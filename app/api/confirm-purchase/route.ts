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
    const { amount } = body;
    console.log(`Processing purchase for user ${userId}, amount: ${amount}`);

    // 3. Determine Credits Logic
    let creditsToAdd = 0;
    const numAmount = parseFloat(amount); // Ensure it's a number

    if (numAmount === 3) creditsToAdd = 5;       // Starter Pack ($3 -> 5 credits)
    else if (numAmount === 9) creditsToAdd = 20; // Pro Pack ($9 -> 20 credits)
    else if (numAmount === 20) creditsToAdd = 60; // Ultimate Pack ($20 -> 60 credits)
    else creditsToAdd = 5;                        // Default fallback

    // 4. Update Database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: creditsToAdd },
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
