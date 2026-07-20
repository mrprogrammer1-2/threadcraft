import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./features/productsSlice";
import cartReducer from "./features/cartSlice";
import {
  loadCartFromStorage,
  saveCartToStorage,
} from "./features/localStorage";

const preloadedCart = loadCartFromStorage();

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  preloadedState: {
    cart: preloadedCart,
  },
});
store.subscribe(() => {
  if (typeof window === "undefined") return;
  const cartState = store.getState().cart;
  saveCartToStorage(cartState.items);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
