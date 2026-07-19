"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      mx = e.clientX;
      my = e.clientY;
      cursorRef.current.style.left = mx - 6 + "px";
      cursorRef.current.style.top = my - 6 + "px";
    };

    function animateRing() {
      if (!ringRef.current) {
        rafId = requestAnimationFrame(animateRing);
        return;
      }
      rx += (mx - rx - 18) * 0.12;
      ry += (my - ry - 18) * 0.12;
      ringRef.current.style.left = rx + "px";
      ringRef.current.style.top = ry + "px";
      rafId = requestAnimationFrame(animateRing);
    }

    const addHoverEffects = () => {
      if (!cursorRef.current || !ringRef.current) return;
      document
        .querySelectorAll("button, a, .swatch, .design-thumb, .upload-zone")
        .forEach((el) => {
          el.addEventListener("mouseenter", () => {
            cursorRef.current!.style.transform = "scale(2)";
            ringRef.current!.style.transform = "scale(1.5)";
          });
          el.addEventListener("mouseleave", () => {
            cursorRef.current!.style.transform = "scale(1)";
            ringRef.current!.style.transform = "scale(1)";
          });
        });
    };

    document.addEventListener("mousemove", onMouseMove);
    animateRing();
    addHoverEffects();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isClient) return null;

  return createPortal(
    <>
      <div
        className="cursor"
        id="cursor"
        ref={cursorRef}
        style={{ left: 0, top: 0 }}
      ></div>
      <div
        className="cursor-ring"
        id="cursorRing"
        ref={ringRef}
        style={{ left: 0, top: 0 }}
      ></div>
    </>,
    document.body,
  );
}
