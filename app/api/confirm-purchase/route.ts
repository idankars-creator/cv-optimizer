import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("🔵 API: /api/confirm-purchase started");
  
  try {
    // 1. Auth Check
    const { userId } = await auth();
    console.log("🔐 Auth check - userId:", userId);
    
    if (!userId) {
      console.error("🔴 API Error: Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Body
    const body = await req.json();
    const { planName, amount, orderId } = body;
    console.log(`📦 Request body:`, { planName, amount, orderId });

    if (!amount || isNaN(parseFloat(amount))) {
      console.error("🔴 Invalid amount:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 3. Determine Credits Logic (matches pricing page)
    let creditsToAdd = 0;
    const numAmount = parseFloat(amount);

    if (numAmount === 3) creditsToAdd = 5;        // Starter Pack ($3 -> 5 credits)
    else if (numAmount === 9) creditsToAdd = 20;  // Pro Pack ($9 -> 20 credits)
    else if (numAmount === 20) creditsToAdd = 60; // Ultimate Pack ($20 -> 60 credits)
    else {
      console.warn(`⚠️ Unexpected amount: ${numAmount}, using default 5 credits`);
      creditsToAdd = 5; // Default fallback
    }

    console.log(`💳 Credits to add: ${creditsToAdd} for $${numAmount}`);

    // 4. Update Database (with upsert for safety)
    console.log("🔄 Upserting user in database...");
    
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

    console.log(`✅ User credits updated: ${updatedUser.credits}`);

    // 5. Record the purchase
    console.log("💾 Recording purchase in database...");
    
    const purchase = await prisma.purchase.create({
      data: {
        userId: userId,
        amount: numAmount,
        plan: planName || "Credit Pack",
        paypalOrderId: orderId || null,
        status: "completed",
      },
    });

    console.log(`✅ Purchase recorded: ${purchase.id}`);
    console.log(`✅ Success: Added ${creditsToAdd} credits. New Balance: ${updatedUser.credits}`);
    
    return NextResponse.json({ 
      success: true, 
      added: creditsToAdd,
      newBalance: updatedUser.credits,
      purchaseId: purchase.id,
    });

  } catch (error: any) {
    console.error("🔥 API CRITICAL ERROR (confirm-purchase):");
    console.error("🔥 Error message:", error?.message);
    console.error("🔥 Error stack:", error?.stack);
    console.error("🔥 Error details:", error);
    
    // Return more detailed error for debugging
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status: 500 });
  }
}
