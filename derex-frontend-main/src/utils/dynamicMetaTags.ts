import type { Project } from "@/models/project";
import type { Property } from "@/models/property";
import type { PropertySearch } from "@/models/property_search";
import { toUrlCase } from "@/utils/common.utils";
import type { Metadata } from "next";

type PropertyForMeta = Property | PropertySearch;

export const baseUrl = process.env.SITE_URL ?? "https://www.javer.com.mx";
const siteBase = baseUrl.replace(/\/$/, "");

function buildDevelopmentKeywords(opts: {
  project: Project;
  stateName?: string;
  cityName?: string;
}): string {
  const { project, stateName, cityName } = opts;
  const words = new Set<string>();

  // Estado y ciudad
  if (stateName) words.add(stateName);
  if (cityName) words.add(cityName);

  if (project.type_orientation === "vertical") {
    words.add("casas en venta");
  } else if (project.type_orientation === "horizontal") {
    words.add("departamentos en venta");
  }

  // Amenidades
  if (project.interest_area?.sp?.length) {
    project.interest_area.sp.forEach((item) => item && words.add(item));
  }
  if (project.equipment?.sp?.length) {
    project.equipment.sp.forEach((item) => item && words.add(item));
  }

  words.add("Javer");
  words.add("vivienda en México");
  words.add("desarrollos inmobiliarios");
  words.add("crédito Infonavit");

  return Array.from(words).join(", ");
}

export function buildDevelopmentMeta(opts: {
  project: Project;
  stateName?: string;
}): Metadata {
  const { project, stateName } = opts;

  const titleMain = project.name;
  const title = `${titleMain} | Inmobiliarias en México | Casas con Infonavit | JAVER`;

  const description =
    project.long_description?.trim() ??
    "Encuentra viviendas en desarrollos de JAVER en México, con opciones de financiamiento como Infonavit.";

  const cityName = project.ciudad;
  const keywords =
    buildDevelopmentKeywords({ project, stateName, cityName }) +
    ", casas en venta, desarrollos inmobiliarios";

  const canonicalPath = `/desarrollos/${toUrlCase(project.short_name ?? "")}`;
  const canonicalUrl = `${siteBase}${canonicalPath}`;

  return {
    metadataBase: new URL(siteBase),
    alternates: {
      canonical: canonicalUrl,
    },
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Javer",
      type: "article",
      images: [
        {
          url: `${siteBase}/images/thumbnail.webp`,
          width: 1200,
          height: 630,
          alt: "Javer | Más de 50 Años Construyendo Patrimonio para las Familias Mexicanas",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        {
          url: `${siteBase}/images/thumbnail.webp`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export function buildPropertyMeta(opts: {
  project: Project;
  property: PropertyForMeta;
  stateName?: string;
}): Metadata {
  const { project, property, stateName } = opts;
  const titleMain = `${property.name} | ${project.name}`;
  const title = `${titleMain} | Inmobiliarias en México | Casas con Infonavit | JAVER`;

  // Construir descripción con especificaciones técnicas
  const specs: string[] = [];
  if (property.rooms)
    specs.push(`${property.rooms} recámara${property.rooms > 1 ? "s" : ""}`);
  if (property.bathrooms)
    specs.push(
      `${property.bathrooms} baño${property.bathrooms > 1 ? "s" : ""}`
    );

  const specsText = specs.length > 0 ? ` - ${specs.join(", ")}` : "";

  // Usar descripción de la propiedad con fallback al proyecto
  const propertyDesc =
    property.description?.trim() ||
    project.long_description?.trim() ||
    "Modelo de vivienda en un desarrollo de JAVER en México.";

  const description = `${property.name}${specsText} - ${propertyDesc}`;

  const cityName = project.ciudad;

  const baseDevKeywords = buildDevelopmentKeywords({
    project,
    stateName,
    cityName,
  })
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const words = new Set<string>(baseDevKeywords);

  // Propiedad / prototipo
  words.add(property.name);

  const keywords = Array.from(words).join(", ");

  const canonicalPath = `/desarrollos/${toUrlCase(
    project.short_name ?? ""
  )}/propiedad/${toUrlCase(property.name ?? "")}`;
  const canonicalUrl = `${siteBase}${canonicalPath}`;

  return {
    metadataBase: new URL(siteBase),
    alternates: {
      canonical: canonicalUrl,
    },
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Javer",
      type: "article",
      images: [
        {
          url: property.main_image || `${siteBase}/images/thumbnail.webp`,
          width: 1200,
          height: 630,
          alt:
            property.main_image_alt_text ||
            `${property.name} en ${project.name} - JAVER`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        {
          url: property.main_image || `${siteBase}/images/thumbnail.webp`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
