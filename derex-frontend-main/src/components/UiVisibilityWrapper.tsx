"use client";

import { usePathname } from "next/navigation";

const ROUTES_WITHOUT_LAYOUT: RegExp[] = [/\/descargables\/.*/];

export function UiVisibilityWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHidden = ROUTES_WITHOUT_LAYOUT.some((route) =>
    pathname?.match(route)
  );

  if (isHidden) return null;

  return <>{children}</>;
}
