import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ credits: 0 });
    }

    // Add logging to track which database we're querying
    const dbUrlPreview = process.env.DATABASE_URL 
      ? `${process.env.DATABASE_URL.substring(0, 40)}...` 
      : "NOT SET";
    console.log(`🔍 [get-credits] Querying DB for userId: ${userId}`);
    console.log(`🔍 [get-credits] DB URL preview: ${dbUrlPreview}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    console.log(`🔍 [get-credits] User found: ${!!user}, Credits: ${user?.credits ?? 0}`);

    return NextResponse.json({ credits: user?.credits ?? 0 });
  } catch (error) {
    console.error("CRITICAL API ERROR (get-credits):", error);
    // Return 0 instead of crashing the UI
    return NextResponse.json({ credits: 0, error: "Server Error" }, { status: 200 });
  }
}
