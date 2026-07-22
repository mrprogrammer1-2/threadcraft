import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ThreadCraft — Custom Embroidery Studio",
    template: "%s | ThreadCraft",
  },
  description:
    "Custom embroidery studio — upload your design, choose your garment, and we'll embroider it with precision. Hand-finished custom apparel.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "ThreadCraft",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
