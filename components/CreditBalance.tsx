"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Zap } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export function CreditBalance() {
  const { userId, isLoaded } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch credits function
  const fetchCredits = useCallback(async () => {
    if (!userId) {
      setCredits(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/get-credits", {
        cache: "no-store", // Ensure fresh data
      });
      const data = await response.json();
      setCredits(data.credits ?? 0);
    } catch (error) {
      console.error("Failed to fetch credit balance:", error);
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true);
      return;
    }

    fetchCredits();

    // Auto-refresh every 5 seconds to catch manual DB updates
    const interval = setInterval(() => {
      if (userId) {
        fetchCredits();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, isLoaded, fetchCredits]);

  // If user is not logged in or still loading, render nothing
  if (!isLoaded || isLoading || !userId || credits === null) {
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
