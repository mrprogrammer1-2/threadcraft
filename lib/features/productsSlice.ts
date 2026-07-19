import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios from "axios";

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  place: "front" | "back" | "left-sleeve" | "right-sleeve" | null;
  position: number | null;
};

type ProductType = {
  id: string;
  name: string;
};

type ProductVariant = {
  id: string;
  productId: string;
  color: string;
  size: string | null;
  stringColor: string | null;
  stock: number | null;
  price: number | null;
};
export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  featured: boolean;
  studioMode: "none" | "free" | "template";
  typeId: string;
  type: ProductType;
  images: ProductImage[];
  variants: ProductVariant[];
};

interface ProductSlice {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductSlice = {
  products: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get<Product[]>("/api/products");
    return response.data;
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const selectAllProducts = (state: RootState) => state.products.products;

export const selectProductsStatus = (state: RootState) => state.products.status;

export const selectProductsError = (state: RootState) => state.products.error;

export default productSlice.reducer;
