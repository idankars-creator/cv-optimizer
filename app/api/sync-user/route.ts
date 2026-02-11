import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

/**
 * Syncs the current Clerk user to Prisma database
 * Call this when a user first loads the app
 */
export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const userEmail = clerkUser?.emailAddresses[0]?.emailAddress || "no-email";

    // Upsert user to ensure they exist in database
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { 
        email: userEmail,
        // Don't update credits on sync, only on actual actions
      },
      create: {
        id: userId,
        email: userEmail,
        credits: 1, // New users start with 1 free credit
      },
    });

    console.log(`✅ User synced: ${userId} (${userEmail})`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
