import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore our studio gallery of hand-embroidered pieces — hoodies, t-shirts, caps, totes and more. Every stitch placed by hand.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
