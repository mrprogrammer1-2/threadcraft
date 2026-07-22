"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

function shouldUseNativeCursor() {
  if (typeof window === "undefined") return true;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  const smallScreen = window.matchMedia("(max-width: 768px)").matches;
  const touchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  return coarsePointer || noHover || smallScreen || touchCapable;
}

/** Returns true only after the component has mounted on the client (hydration-safe) */
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
  // Default to native cursor until we've actually checked — avoids any flash
  const [useNative, setUseNative] = useState(true);

  // Detect native-cursor devices, and keep it reactive to resize/orientation/devtools toggling
  useEffect(() => {
    if (!isClient) return;

    const update = () => setUseNative(shouldUseNativeCursor());
    update();

    const mqList = [
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(hover: none)"),
      window.matchMedia("(max-width: 768px)"),
    ];
    mqList.forEach((mq) => mq.addEventListener("change", update));
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      mqList.forEach((mq) => mq.removeEventListener("change", update));
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [isClient]);

  // Cursor-follow logic only runs when we've decided this is NOT a native-cursor device
  useEffect(() => {
    if (!isClient || useNative) return;

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
  }, [isClient, useNative]);

  // Hydration-safe: null on server, first client render, AND on native-cursor devices
  if (!isClient || useNative) return null;

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
