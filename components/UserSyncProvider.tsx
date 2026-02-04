"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

/**
 * Syncs authenticated users to Prisma database on first load
 * Add this component to your root layout
 */
export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const hasSynced = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !userId || hasSynced.current) {
        return;
      }

      try {
        hasSynced.current = true; // Prevent multiple syncs
        
        await fetch('/api/sync-user', {
          method: 'POST',
          cache: 'no-store',
        });
      } catch (error) {
        console.error("Failed to sync user:", error);
      }
    };

    syncUser();
  }, [userId, isLoaded]);

  return <>{children}</>;
}
