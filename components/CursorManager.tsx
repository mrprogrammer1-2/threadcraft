"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

function isNativeCursorDevice() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(max-width: 768px)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

export default function CursorManager() {
  const pathname = usePathname();

  useEffect(() => {
    const isNativeCursorRoute =
      pathname?.startsWith("/admin") || pathname?.startsWith("/studio");

    const applyState = () => {
      if (isNativeCursorRoute || isNativeCursorDevice()) {
        document.body.classList.remove("cursor-none");
        document.body.style.cursor = "";
      } else {
        document.body.classList.add("cursor-none");
        document.body.style.cursor = "";
      }
    };

    applyState();

    window.addEventListener("resize", applyState);
    window.addEventListener("orientationchange", applyState);

    return () => {
      document.body.classList.remove("cursor-none");
      document.body.style.cursor = "";
      window.removeEventListener("resize", applyState);
      window.removeEventListener("orientationchange", applyState);
    };
  }, [pathname]);

  return null;
}
