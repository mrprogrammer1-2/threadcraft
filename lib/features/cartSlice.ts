import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type cartItem = {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  variantId: string;
  quantity: number;
  imageUrl: string;
};

const initialState = {
  items: [] as cartItem[],
  totalQuantity: 0,
  totalPrice: 0,
  isHydrating: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
      state.totalQuantity = action.payload.reduce(
        (total: number, item: cartItem) => total + item.quantity,
        0,
      );
      state.totalPrice = action.payload.reduce(
        (total: number, item: cartItem) => total + item.price * item.quantity,
        0,
      );
      state.isHydrating = false;
    },
    setHydrating(state, action: { payload: boolean }) {
      state.isHydrating = action.payload;
    },
    addToCart(state, action) {
      const existing = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.variantId === action.payload.variantId &&
          item.color === action.payload.color &&
          item.size === action.payload.size,
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.totalPrice += action.payload.price;
    },
    increaseQuantity(state, action) {
      const item = state.items.find((i) => i.variantId === action.payload);
      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += item.price;
      }
    },
    decreaseQuantity(state, action) {
      const item = state.items.find((i) => i.variantId === action.payload);
      if (item) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= item.price;

        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.variantId !== action.payload,
          );
        }
      }
    },
    removeFromCart(state, action) {
      const item = state.items.find((i) => i.variantId === action.payload);
      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        state.items = state.items.filter((i) => i.variantId !== action.payload);
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const allCartItems = (state: RootState) => state.cart.items;
export const cartTotalQuantity = (state: RootState) => state.cart.totalQuantity;
export const cartIsHydrating = (state: RootState) => state.cart.isHydrating;

export const {
  setCart,
  setHydrating,
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
