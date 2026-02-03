import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Zap } from "lucide-react";

export async function CreditBalance() {
  const { userId } = await auth();

  // If user is not logged in, render nothing
  if (!userId) {
    return null;
  }

  try {
    // Fetch user credits from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    // If user doesn't exist in DB yet, show 0 or default
    const credits = user?.credits ?? 0;

    return (
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors"
        title="View your credit balance"
      >
        <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span>{credits}</span>
      </Link>
    );
  } catch (error) {
    console.error("Failed to fetch credit balance:", error);
    // On error, render nothing to avoid breaking the UI
    return null;
  }
}
