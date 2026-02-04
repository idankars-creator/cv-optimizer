import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("🔍 DEBUG API: Starting credit test...");
  
  try {
    // 1. Auth Check
    const { userId } = await auth();
    console.log("🔍 Auth result - userId:", userId);
    
    if (!userId) {
      return NextResponse.json({ 
        error: "Not logged in",
        step: "auth"
      }, { status: 401 });
    }

    // 2. Check if user exists
    console.log("🔍 Checking if user exists in database...");
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { id: true, email: true, credits: true }
    });
    
    console.log("🔍 User found:", user);
    
    if (!user) {
      return NextResponse.json({ 
        error: "User not found in database",
        step: "find_user",
        userId: userId,
        suggestion: "User may need to be created first"
      }, { status: 404 });
    }

    const oldBalance = user.credits;
    console.log(`🔍 Current balance: ${oldBalance}`);

    // 3. Try to update credits
    console.log("🔍 Attempting to increment credits by 5...");
    
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: 5 } }
    });

    console.log(`✅ Success! New balance: ${updated.credits}`);

    return NextResponse.json({ 
      success: true,
      oldBalance: oldBalance,
      newBalance: updated.credits,
      added: 5,
      userId: userId,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("🔥 DEBUG ERROR:", error);
    console.error("🔥 Error name:", error.name);
    console.error("🔥 Error message:", error.message);
    console.error("🔥 Error code:", error.code);
    console.error("🔥 Error meta:", error.meta);
    console.error("🔥 Full error:", JSON.stringify(error, null, 2));
    
    return NextResponse.json({ 
      error: "Database operation failed",
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      errorMeta: error.meta,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
