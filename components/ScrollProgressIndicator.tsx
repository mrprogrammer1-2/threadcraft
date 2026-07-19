"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId = 0;

    const updateProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        scrollHeight > 0
          ? Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100))
          : 0;

      setProgress(nextProgress);
      frameId = 0;
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="scroll-progress-indicator"
      style={{ pointerEvents: "none" }}
    >
      <div className="scroll-progress-track" />
      <div
        className="scroll-progress-fill"
        style={{ transform: `scaleY(${progress / 100})` }}
      />
    </div>
  );
}
