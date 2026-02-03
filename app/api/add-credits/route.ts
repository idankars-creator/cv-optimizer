import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Map plan names to credit amounts
const PLAN_CREDITS: Record<string, number> = {
  "Starter": 5,
  "Pro": 20,
  "Ultimate": 60,
};

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, amount, orderId } = body;

    if (!plan || !amount) {
      return NextResponse.json(
        { error: "Plan and amount are required" },
        { status: 400 }
      );
    }

    // Determine credits based on plan
    const creditsToAdd = PLAN_CREDITS[plan];
    
    if (creditsToAdd === undefined) {
      return NextResponse.json(
        { error: "Invalid plan name" },
        { status: 400 }
      );
    }

    // Get user info from Clerk for email
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress || "no-email";

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Upsert user to ensure they exist in database
      // New users get 1 free credit, existing users keep their credits
      const dbUser = await tx.user.upsert({
        where: { id: userId },
        update: { email: userEmail },
        create: {
          id: userId,
          email: userEmail,
          credits: 1, // New users start with 1 free credit
        },
      });

      // Create purchase record
      const purchase = await tx.purchase.create({
        data: {
          userId: userId,
          amount: parseFloat(amount.toString()),
          plan: plan,
          paypalOrderId: orderId || null,
          status: "completed",
        },
      });

      // Update user credits
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: creditsToAdd,
          },
        },
      });

      return {
        purchase,
        user: updatedUser,
        creditsAdded: creditsToAdd,
      };
    });

    console.log(`✅ Added ${result.creditsAdded} credits to user ${userId} for plan: ${plan}`);

    return NextResponse.json({
      success: true,
      message: "Credits added successfully",
      creditsAdded: result.creditsAdded,
      totalCredits: result.user.credits,
      purchaseId: result.purchase.id,
    });
  } catch (error) {
    console.error("Add credits error:", error);
    return NextResponse.json(
      { error: "Failed to add credits" },
      { status: 500 }
    );
  }
}
