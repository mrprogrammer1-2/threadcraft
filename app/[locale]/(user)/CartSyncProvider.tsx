"use client";

import { useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useSyncCart } from "@/lib/hooks/useSyncCart";

export function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useKindeBrowserClient();
  const syncCart = useSyncCart();

  useEffect(() => {
    // Only sync once user is loaded and logged in
    if (!isLoading && user?.id) {
      void syncCart();
    }
  }, [user?.id, isLoading, syncCart]);

  return <>{children}</>;
}
