"use client";

import { useAppDispatch } from "@/lib/hooks";
import { addToCart } from "@/lib/features/cartSlice";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export type AddToCartItem = {
  productId: string;
  productName: string;
  variantId: string;
  color: string;
  size: string;
  price: number;
  quantity?: number;
  imageUrl?: string | null;
  customization?: Record<string, unknown> | null;
};

export function useAddToCart() {
  const dispatch = useAppDispatch();
  const { user } = useKindeBrowserClient();

  return async (item: AddToCartItem) => {
    if (!item.variantId) return;

    dispatch(
      addToCart({
        id: item.productId,
        variantId: item.variantId,
        name: item.productName,
        color: item.color,
        size: item.size || "",
        price: item.price,
        quantity: item.quantity ?? 1,
        imageUrl: item.imageUrl ?? "",
      }),
    );

    if (!user?.id) {
      return;
    }

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity ?? 1,
              unitPrice: item.price,
              customization: item.customization ?? null,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to persist cart item to server", error);
      alert(
        `Error adding item: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
      );
    }
  };
}
