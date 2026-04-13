"use client";

import { Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toTitleCase } from "@/utils/common.utils";

interface BreadcrumbSegmentOverride {
  label: string;
  href?: string;
}

interface DynamicBreadcrumbProps {
  overrides?: Record<string, BreadcrumbSegmentOverride>;
  hideSegments?: string[];
  className?: string;
}

const SEGMENT_TRANSLATION_KEYS: Record<string, string> = {
  desarrollos: "developments",
  estados: "states",
  blog: "javerBlog",
  contacto: "contact",
  nosotros: "us",
  lotes: "plots",
  certificaciones: "certifications",
  equipo: "us",
  "avisos-de-privacidad": "privacyNotices",
  "contratos-de-adhesion": "contracts",
  decalogos: "decalogues",
  "servicio-a-clientes": "customerService",
  "reservas-territoriales": "landReserves",
  credit: "creditTypes",
  "codigo-de-etica": "codeOfEthics",
  "decalogo-de-no-discriminacion": "decalogues",
};

const DEFAULT_HIDDEN_SEGMENTS = ["propiedad"];

export function DynamicBreadcrumb({
  overrides = {},
  hideSegments = DEFAULT_HIDDEN_SEGMENTS,
  className,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();
  const { t } = useTranslation("translations");

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    const cleanPath = pathname.split("?")[0].split("#")[0];
    const rawSegments = cleanPath.split("/").filter(Boolean);

    type BreadcrumbEntry = {
      label: string;
      href: string;
      isCurrent: boolean;
    };

    const hiddenSet = new Set(hideSegments.map((s) => s.toLowerCase()));
    const visibleSegments: string[] = [];
    const segmentPaths: string[] = [];
    let cumulativePath = "";

    for (const segment of rawSegments) {
      cumulativePath += `/${segment}`;
      if (!hiddenSet.has(segment.toLowerCase())) {
        visibleSegments.push(segment);
        segmentPaths.push(cumulativePath);
      }
    }

    const items: BreadcrumbEntry[] = visibleSegments.map((segment, i) => {
      const decoded = decodeURIComponent(segment);
      const key = decoded.toLowerCase();
      const isLast = i === visibleSegments.length - 1;

      let label: string;
      let href: string = segmentPaths[i];

      if (overrides[key]) {
        label = overrides[key].label;
        if (overrides[key].href) {
          href = overrides[key].href!;
        }
      } else if (SEGMENT_TRANSLATION_KEYS[key]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label = t(SEGMENT_TRANSLATION_KEYS[key] as any);
      } else {
        label = toTitleCase(decoded);
      }

      return { label, href, isCurrent: isLast };
    });

    return items;
  }, [pathname, overrides, hideSegments, t]);

  if (!pathname || pathname === "/") {
    return null;
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{t("homeStart")}</BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isCurrent ? (
                <BreadcrumbPage className="text-primary font-bold font-roboto">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
