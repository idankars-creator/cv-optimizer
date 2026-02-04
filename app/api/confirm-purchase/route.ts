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

export async function POST(request: Request) {
  try {
    // Validate user is logged in
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planName, amount, orderId } = body;

    if (!planName || !amount) {
      return NextResponse.json(
        { error: "Plan name and amount are required" },
        { status: 400 }
      );
    }

    // Determine how many credits to add based on plan
    const creditsToAdd = PLAN_CREDITS[planName];
    
    if (creditsToAdd === undefined) {
      return NextResponse.json(
        { error: "Invalid plan name" },
        { status: 400 }
      );
    }

    // Get user email from Clerk
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress || "no-email";

    // Use transaction to ensure data consistency
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

      // Create purchase record
      await tx.purchase.create({
        data: {
          userId: userId,
          amount: parseFloat(amount.toString()),
          plan: planName,
          paypalOrderId: orderId || null,
          status: "completed",
        },
      });

      // Increment user credits
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: creditsToAdd,
          },
        },
      });

      return {
        creditsAdded: creditsToAdd,
        newBalance: updatedUser.credits,
      };
    });

    console.log(`✅ Purchase confirmed: Added ${result.creditsAdded} credits to user ${userId}. New balance: ${result.newBalance}`);

    return NextResponse.json({
      success: true,
      creditsAdded: result.creditsAdded,
      newBalance: result.newBalance,
      message: `Successfully added ${result.creditsAdded} credits to your account`,
    });
  } catch (error) {
    console.error("Confirm purchase error:", error);
    return NextResponse.json(
      { error: "Failed to confirm purchase and add credits" },
      { status: 500 }
    );
  }
}
