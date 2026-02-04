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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    return NextResponse.json({ credits: user?.credits ?? 0 });
  } catch (error) {
    console.error("CRITICAL API ERROR (get-credits):", error);
    // Return 0 instead of crashing the UI
    return NextResponse.json({ credits: 0, error: "Server Error" }, { status: 200 });
  }
}
