"use client";

import { useState, useEffect } from "react";

const INTERACTION_EVENTS = [
  "mousemove",
  "scroll",
  "touchstart",
  "keydown",
  "wheel",
  "pointerdown",
] as const;

export function useUserInteraction(): boolean {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (hasInteracted) return;

    const handleInteraction = () => {
      setHasInteracted(true);
    };

    INTERACTION_EVENTS.forEach((event) => {
      window.addEventListener(event, handleInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      INTERACTION_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [hasInteracted]);

  return hasInteracted;
}
