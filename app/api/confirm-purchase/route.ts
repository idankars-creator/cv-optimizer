import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log("🔵 API: confirm-purchase started");

    // 1. Auth Check
    const { userId } = await auth();
    if (!userId) {
      console.error("🔴 API Error: Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Body
    const body = await req.json();
    const { planName, amount, orderId } = body;
    console.log(`Processing purchase for user ${userId}, plan: ${planName}, amount: ${amount}`);

    // 3. Determine Credits Logic (matches pricing page)
    let creditsToAdd = 0;
    const numAmount = parseFloat(amount);

    if (numAmount === 3) creditsToAdd = 5;        // Starter Pack ($3 -> 5 credits)
    else if (numAmount === 9) creditsToAdd = 20;  // Pro Pack ($9 -> 20 credits)
    else if (numAmount === 20) creditsToAdd = 60; // Ultimate Pack ($20 -> 60 credits)
    else creditsToAdd = 5;                         // Default fallback

    console.log(`Credits to add: ${creditsToAdd}`);

    // 4. Update Database (with upsert for safety)
    const updatedUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        credits: { increment: creditsToAdd },
      },
      create: {
        id: userId,
        email: "pending@update.com", // Will be updated on next auth sync
        credits: 5 + creditsToAdd,   // Default 5 + purchased
      },
    });

    // 5. Record the purchase
    await prisma.purchase.create({
      data: {
        userId: userId,
        amount: numAmount,
        plan: planName || "Credit Pack",
        paypalOrderId: orderId || null,
        status: "completed",
      },
    });

    console.log(`✅ Success: Added ${creditsToAdd} credits. New Balance: ${updatedUser.credits}`);
    
    return NextResponse.json({ 
      success: true, 
      added: creditsToAdd,
      newBalance: updatedUser.credits 
    });

  } catch (error) {
    console.error("🔥 API CRITICAL ERROR (confirm-purchase):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
