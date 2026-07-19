import { cartItem } from "./cartSlice";

export const loadCartFromStorage = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const serialized = localStorage.getItem("cart");
    if (serialized === null) return undefined; // nothing saved yet
    if (!serialized || serialized === "undefined") return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    console.error("Could not load cart:", err);
    return undefined;
  }
};

export const saveCartToStorage = (cartState: cartItem[]) => {
  try {
    const serialized = JSON.stringify(cartState);
    localStorage.setItem("cart", serialized);
  } catch (err) {
    console.error("Could not save cart:", err);
  }
};
