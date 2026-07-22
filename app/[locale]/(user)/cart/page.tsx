import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review your customized embroidery items and proceed to checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
