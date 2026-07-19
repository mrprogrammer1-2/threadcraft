"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useAppDispatch, useAppSelector } from "../hooks";
import { allCartItems, clearCart, addToCart } from "../features/cartSlice";

const HAS_SYNCED_KEY = "cart-synced";

export function useSyncCart() {
  const dispatch = useAppDispatch();
  const { user } = useKindeBrowserClient();
  const localItems = useAppSelector(allCartItems);

  return async () => {
    if (!user?.id) return;

    const hasSynced = localStorage.getItem(HAS_SYNCED_KEY);

    try {
      // Step 1: Sync local Redux items to server if not yet synced
      if (localItems.length && !hasSynced) {
        const syncResponse = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: localItems.map((item) => ({
              productId: item.id,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
          }),
        });

        if (!syncResponse.ok) {
          const errData = await syncResponse.json().catch(() => ({}));
          throw new Error(
            errData.error || `Sync failed: ${syncResponse.status}`,
          );
        }

        localStorage.setItem(HAS_SYNCED_KEY, "true");
      }

      // Step 2: Fetch the cart from DB and populate Redux
      const cartResponse = await fetch("/api/orders/get");
      if (!cartResponse.ok) {
        throw new Error("Failed to fetch cart from server");
      }

      const { items: dbCartItems } = await cartResponse.json();

      // Step 3: Clear local Redux and repopulate with DB cart
      dispatch(clearCart());
      dbCartItems.forEach(
        (item: {
          id: string;
          variantId: string;
          quantity: number;
          price: number;
        }) => {
          dispatch(addToCart(item));
        },
      );
    } catch (error) {
      console.error("Failed to sync cart:", error);
      // Don't clear sync flag on error so retry can happen next time
      localStorage.removeItem(HAS_SYNCED_KEY);
    }
  };
}
