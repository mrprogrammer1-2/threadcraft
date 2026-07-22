import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designs",
  description:
    "Manage your studio design library — SVG motifs and PNG assets for customer embroidery customization.",
};

export default function DesignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
