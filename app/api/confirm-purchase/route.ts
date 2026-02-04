import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Map plan names to credit amounts
const PLAN_CREDITS: Record<string, number> = {
  "Starter": 5,
  "Pro": 20,
  "Ultimate": 60,
};

export async function POST(req: Request) {
  try {
    console.log("🔵 API: confirm-purchase called");
    
    // 1. Check Auth
    const { userId } = await auth();
    if (!userId) {
      console.error("🔴 API Error: User not logged in");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔵 API: User authenticated:", userId);

    // 2. Parse Body
    const body = await req.json();
    console.log("🔵 API Payload:", JSON.stringify(body, null, 2));
    
    const { planName, amount, orderId } = body;

    if (!planName || !amount) {
      console.error("🔴 API Error: Missing planName or amount");
      return NextResponse.json(
        { error: "Plan name and amount are required" },
        { status: 400 }
      );
    }

    // 3. Determine Credits based on plan name
    const creditsToAdd = PLAN_CREDITS[planName];
    
    if (creditsToAdd === undefined) {
      console.error("🔴 API Error: Invalid plan name:", planName);
      return NextResponse.json(
        { error: "Invalid plan name" },
        { status: 400 }
      );
    }

    console.log(`🔵 Adding ${creditsToAdd} credits to user ${userId} for plan: ${planName}`);

    // 4. Get user email for upsert
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress || "no-email";

    // 5. Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Ensure user exists in database
      const dbUser = await tx.user.upsert({
        where: { id: userId },
        update: { email: userEmail },
        create: {
          id: userId,
          email: userEmail,
          credits: 5, // New users start with 5 free credits
        },
      });

      console.log("🔵 User found/created with current credits:", dbUser.credits);

      // Create purchase record
      const purchase = await tx.purchase.create({
        data: {
          userId: userId,
          amount: parseFloat(amount.toString()),
          plan: planName,
          paypalOrderId: orderId || null,
          status: "completed",
        },
      });

      console.log("🔵 Purchase record created:", purchase.id);

      // Update user credits
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: creditsToAdd,
          },
        },
      });

      console.log("🔵 Credits updated. New balance:", updatedUser.credits);

      return {
        purchase,
        user: updatedUser,
        creditsAdded: creditsToAdd,
      };
    });

    console.log("✅ API Success: Credits updated", {
      userId,
      creditsAdded: result.creditsAdded,
      newBalance: result.user.credits,
      purchaseId: result.purchase.id,
    });

    return NextResponse.json({
      success: true,
      creditsAdded: result.creditsAdded,
      newBalance: result.user.credits,
      message: `Successfully added ${result.creditsAdded} credits`,
    });

  } catch (error) {
    console.error("🔥 API Critical Error:", error);
    console.error("🔥 Error details:", error instanceof Error ? error.message : String(error));
    console.error("🔥 Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
