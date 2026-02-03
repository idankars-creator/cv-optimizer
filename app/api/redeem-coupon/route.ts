import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    // Find coupon (case-insensitive search)
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: {
          equals: code.trim(),
          mode: "insensitive",
        },
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { error: "This coupon is no longer active" },
        { status: 400 }
      );
    }

    // Get user info from Clerk for email
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress || "no-email";

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Upsert user to ensure they exist in database
      const dbUser = await tx.user.upsert({
        where: { id: userId },
        update: { email: userEmail },
        create: {
          id: userId,
          email: userEmail,
          credits: 1, // New users start with 1 free credit
        },
      });

      // Increment user credits
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: coupon.credits,
          },
        },
      });

      return {
        user: updatedUser,
        creditsAdded: coupon.credits,
        couponCode: coupon.code,
      };
    });

    console.log(`✅ Redeemed coupon ${coupon.code} for user ${userId}. Added ${result.creditsAdded} credits.`);

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed coupon! Added ${result.creditsAdded} credits.`,
      creditsAdded: result.creditsAdded,
      totalCredits: result.user.credits,
      couponCode: result.couponCode,
    });
  } catch (error) {
    console.error("Redeem coupon error:", error);
    return NextResponse.json(
      { error: "Failed to redeem coupon" },
      { status: 500 }
    );
  }
}
