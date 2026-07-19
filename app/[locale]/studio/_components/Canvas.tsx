"use client";

interface EmbState {
  width: number;
  top: string;
  left: string;
  content: string | null; // raw HTML string (svg or img)
}

export default function Canvas() {
  return <div></div>;
}

export type { EmbState };
