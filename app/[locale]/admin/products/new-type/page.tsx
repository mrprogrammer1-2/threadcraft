import type { Metadata } from "next";
import ProductTypeForm from "./ProductTypeForm";

export const metadata: Metadata = {
  title: "New Product Type",
  description:
    "Define a new product category — configure sizing, thread colors, and image placements.",
};

export default function page() {
  return <ProductTypeForm />;
}
