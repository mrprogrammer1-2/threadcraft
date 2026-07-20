"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

function isTouchDevice() {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
}

export default function CursorManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't hide native cursor on touch devices — custom cursor isn't rendered
    if (isTouchDevice()) {
      document.body.classList.remove("cursor-none");
      document.body.style.cursor = "";
      return;
    }

    const isNativeCursorRoute =
      pathname?.startsWith("/admin") || pathname?.startsWith("/studio");

    if (isNativeCursorRoute) {
      document.body.classList.remove("cursor-none");
      document.body.style.cursor = "";
    } else {
      document.body.classList.add("cursor-none");
      document.body.style.cursor = "";
    }

    return () => {
      document.body.classList.remove("cursor-none");
      document.body.style.cursor = "";
    };
  }, [pathname]);

  return null;
}
