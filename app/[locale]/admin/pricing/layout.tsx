import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Configure ThreadCraft's customization pricing — set per-side embroidery pricing for customer orders.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
