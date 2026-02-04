import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    
    const dbInfo: any = {
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL 
        ? `${process.env.DATABASE_URL.substring(0, 30)}...` 
        : "NOT SET",
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      userId: userId || "Not logged in",
      timestamp: new Date().toISOString(),
    };

    if (userId) {
      try {
        // Try to query the database
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, credits: true, createdAt: true },
        });

        dbInfo.userExists = !!user;
        dbInfo.userCredits = user?.credits ?? null;
        dbInfo.userEmail = user?.email ?? null;
        
        // Try to count all users
        const userCount = await prisma.user.count();
        dbInfo.totalUsersInDb = userCount;

        // Try to get recent purchases
        const recentPurchases = await prisma.purchase.findMany({
          where: { userId: userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, amount: true, plan: true, createdAt: true },
        });
        dbInfo.recentPurchases = recentPurchases;
        dbInfo.purchaseCount = recentPurchases.length;

      } catch (dbError: any) {
        dbInfo.databaseError = {
          message: dbError.message,
          code: dbError.code,
          name: dbError.name,
        };
      }
    }

    return NextResponse.json(dbInfo);
  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to get DB info",
      message: error.message,
      environment: process.env.NODE_ENV,
    }, { status: 500 });
  }
}
