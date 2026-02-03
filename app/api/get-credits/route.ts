export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { credits: 0 },
        { status: 200 }
      );
    }

    // Fetch user credits from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    // If user doesn't exist in DB yet, return 0
    const credits = user?.credits ?? 0;

    return NextResponse.json({
      credits,
      success: true,
    });
  } catch (error) {
    console.error("Get credits error:", error);
    return NextResponse.json(
      { credits: 0, error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
