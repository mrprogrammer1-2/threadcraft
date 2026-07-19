"use client";

import { Link } from "@/i18n/navigation"; // Kept consistent with your main navbar
import { useAppSelector } from "@/lib/hooks";
import { cartTotalQuantity, cartIsHydrating } from "@/lib/features/cartSlice";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function CartIcon() {
  const quantity = useAppSelector(cartTotalQuantity);
  const isHydrating = useAppSelector(cartIsHydrating);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      aria-label="View cart"
      className="relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-(--ink) text-(--ink) transition-colors duration-200 hover:bg-(--ink) hover:text-(--cream) shrink-0"
    >
      {/* Modern SVG icon scales beautifully from size 16 to 18 */}
      <ShoppingBag
        className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
        strokeWidth={2}
      />

      {mounted &&
        (isHydrating ? (
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-(--ink)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--cream) animate-pulse" />
          </span>
        ) : quantity > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 inline-flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-(--ink) px-1 text-[9px] sm:text-[10px] text-(--cream) font-medium">
            {quantity}
          </span>
        ) : null)}
    </Link>
  );
}
