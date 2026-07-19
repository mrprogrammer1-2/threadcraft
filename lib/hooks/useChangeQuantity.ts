import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  allCartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../features/cartSlice";

export function useChangeQuantity() {
  const dispatch = useAppDispatch();
  const { user } = useKindeBrowserClient();
  const items = useAppSelector(allCartItems);

  return async (variantId: string, newQuantity: number) => {
    if (!variantId || newQuantity < 0) return;

    // Find current item to calculate difference
    const currentItem = items.find((item) => item.variantId === variantId);
    if (!currentItem) return;

    const currentQty = currentItem.quantity;
    const difference = newQuantity - currentQty;

    // Update Redux immediately
    if (newQuantity === 0) {
      dispatch(removeFromCart(variantId));
    } else if (difference > 0) {
      for (let i = 0; i < difference; i++) {
        dispatch(increaseQuantity(variantId));
      }
    } else if (difference < 0) {
      for (let i = 0; i < Math.abs(difference); i++) {
        dispatch(decreaseQuantity(variantId));
      }
    }

    // Sync with server if user is authenticated
    if (!user?.id) {
      console.warn(
        "User not authenticated; quantity change stored locally only",
      );
      return;
    }

    try {
      const response = await fetch("/api/orders/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity: newQuantity }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update quantity on server", error);
      // Rollback: revert to original quantity in Redux
      const rollbackDiff = currentQty - newQuantity;
      if (rollbackDiff > 0) {
        for (let i = 0; i < rollbackDiff; i++) {
          dispatch(decreaseQuantity(variantId));
        }
      } else if (rollbackDiff < 0) {
        for (let i = 0; i < Math.abs(rollbackDiff); i++) {
          dispatch(increaseQuantity(variantId));
        }
      }
      alert(
        `Error updating quantity: ${error instanceof Error ? error.message : "Unknown error"}. Changes reverted.`,
      );
    }
  };
}
