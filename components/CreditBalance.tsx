"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function CreditBalance() {
  const { userId, isLoaded } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoaded || !userId) {
      setCredits(null);
      return;
    }

    // Fetch credits from API
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/get-credits");
        const data = await response.json();
        setCredits(data.credits ?? 0);
      } catch (error) {
        console.error("Failed to fetch credit balance:", error);
        setCredits(0);
      }
    };

    fetchCredits();
  }, [userId, isLoaded]);

  // If user is not logged in or not loaded, render nothing
  if (!isLoaded || !userId || credits === null) {
    return null;
  }

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
}
