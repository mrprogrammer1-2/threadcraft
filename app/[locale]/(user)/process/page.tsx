import type { Metadata } from "next";
import React from "react";
import ProcessClient from "./ProcessClient";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From idea to stitched reality in four steps. Choose your garment, design in the studio, we embroider it, and it's delivered to your door.",
};

export default function ProcessPage() {
  return (
    <main>
      <ProcessClient />
    </main>
  );
}
