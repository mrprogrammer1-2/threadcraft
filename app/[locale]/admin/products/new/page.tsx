import type { Metadata } from "next";
import ProductForm from "./ProductForm";

export const metadata: Metadata = {
  title: "New Product",
  description:
    "Create a new product in the ThreadCraft catalogue — add details, images, variants, and studio settings.",
};

export default function page() {
  return <ProductForm />;
}
