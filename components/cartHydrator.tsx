"use client";
import { syncCart } from "@/lib/actions/cart/syncCart";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCart, setHydrating, allCartItems } from "@/lib/features/cartSlice";

const HAS_SYNCED_KEY = "cart-synced";

async function fetchUserCart() {
  const res = await fetch("/api/orders/get", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

export function CartHydrator() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const dispatch = useAppDispatch();
  const localItems = useAppSelector(allCartItems);
  const localItemsRef = useRef(localItems);
  const hasRun = useRef(false);

  // Keep ref in sync without causing effect re-runs
  localItemsRef.current = localItems;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      dispatch(setHydrating(false));
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const hasSynced = localStorage.getItem(HAS_SYNCED_KEY);
    const items = localItemsRef.current;

    (async () => {
      const serverItems = await fetchUserCart();

      if (items.length && !hasSynced) {
        await syncCart(
          items.map((item) => ({
            productId: item.id,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        );
        localStorage.setItem(HAS_SYNCED_KEY, "true");
        const freshItems = await fetchUserCart();
        dispatch(setCart(freshItems));
        return;
      }

      dispatch(setCart(serverItems));
    })();
  }, [isAuthenticated, isLoading, dispatch]);

  return null;
}
