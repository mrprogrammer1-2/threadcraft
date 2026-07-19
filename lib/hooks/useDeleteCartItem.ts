"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeFromCart, addToCart, allCartItems } from "../features/cartSlice";

export function useDeleteCartItem() {
  const dispatch = useAppDispatch();
  const { user } = useKindeBrowserClient();
  const items = useAppSelector(allCartItems);

  return async (variantId: string) => {
    if (!variantId) return;

    // Save item in case we need to rollback
    const itemToDelete = items.find((item) => item.variantId === variantId);

    // Optimistic delete
    dispatch(removeFromCart(variantId));

    if (!user?.id) {
      console.warn("User not authenticated; item removed locally only");
      return;
    }

    try {
      const response = await fetch("/api/orders/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete cart item from server", error);
      // Rollback: re-add item to Redux
      if (itemToDelete) {
        dispatch(addToCart(itemToDelete));
      }
      alert(
        `Error removing item: ${error instanceof Error ? error.message : "Unknown error"}. Changes reverted.`,
      );
    }
  };
}
