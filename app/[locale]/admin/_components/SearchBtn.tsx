"use client";

import { LoaderCircle, Search } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SearchBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 border border-border bg-surface px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-dim hover:border-sienna/60 hover:text-cream transition-colors disabled:opacity-50"
    >
      {pending ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Search className="h-3.5 w-3.5" />
      )}
      Search
    </button>
  );
}
