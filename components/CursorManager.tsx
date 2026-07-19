"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

export default function CursorManager() {
  const pathname = usePathname();

  useEffect(() => {
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
