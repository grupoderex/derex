"use client";

import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const WhatsappFAB = () => {
  const pathname = usePathname();

  useEffect(() => {
    const botDiv = document.querySelector('div:has(iframe[title="Botmaker"])');

    if (pathname === "/servicio-a-clientes") {
      botDiv?.classList.add("hidden-bot");
    } else {
      botDiv?.classList.remove("hidden-bot");
    }
  }, [pathname]);

  if (pathname === "/servicio-a-clientes") return null;

  return (
    <div
      className="bg-green-500 w-14 h-14 flex items-center justify-center rounded-full shadow-lg fixed bottom-44 right-4 cursor-pointer z-19"
      onClick={() => window.open("https://wa.me/526621745601?text=Hola%20quisiera%20solicitar%20mas%20informaci%C3%B3n")}
    >
      <Icon icon="fa-brands:whatsapp" width="32" className="text-white" />
    </div>
  );
};
