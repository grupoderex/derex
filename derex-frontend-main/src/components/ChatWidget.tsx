"use client";

import { useUserInteraction } from "@/hooks/useUserInteraction";
import Script from "next/script";
import { useCallback, useState } from "react";

export function ChatWidget() {
  const [isBotmakerReady, setIsBotmakerReady] = useState(false);
  const hasInteracted = useUserInteraction();

  const handleScriptLoad = useCallback(() => {
    const checkWidget = setInterval(() => {
      const widget = document.querySelector(
        '[id*="botmaker"], [class*="botmaker"]'
      );

      if (widget) {
        setIsBotmakerReady(true);
        clearInterval(checkWidget);
      }
    }, 100);

    setTimeout(() => {
      setIsBotmakerReady(true);
      clearInterval(checkWidget);
    }, 3000);
  }, []);

  const handleScriptError = useCallback((e: Error) => {
    console.error("Error al cargar Botmaker:", e);
  }, []);

  const showPlaceholder = hasInteracted && !isBotmakerReady;

  return (
    <>
      {
        showPlaceholder && null
        // <div
        //   className="fixed bottom-16 right-3 z-50 animate-pulse"
        //   aria-hidden="true"
        // >
        //   <div className="w-14 h-14 rounded-full bg-gray-300 shadow-lg" />
        // </div>
      }

      {hasInteracted && (
        <Script
          src="https://go.botmaker.com/rest/webchat/p/PQ2XODBE2N/init.js"
          strategy="afterInteractive"
          onLoad={handleScriptLoad}
          onError={handleScriptError}
        />
      )}
    </>
  );
}
