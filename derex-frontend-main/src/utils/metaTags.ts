import { Metadata } from "next";

const siteUrl = (process.env.SITE_URL || "https://derexqa.online").replace(
  /\/+$/,
  ""
);
const baseUrl = `${siteUrl}/`;

export const GLOBAL: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Inmobiliarias en México | Casas con Infonavit | JAVER",
  description:
    "Encuentra las mejores casas a los precios más accesibles con la seguridad y plusvalía para tu familia ¡Si piensas comprar una casa ven a Javer!",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    images: [
      {
        url: `${baseUrl}images/thumbnail.webp`,
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
        url: `${baseUrl}images/thumbnail.webp`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const HOME_META: Metadata = {
  metadataBase: new URL(siteUrl), // para links
  alternates: {
    canonical: `${siteUrl}/`,
  },
  title: "Casas en Venta en México | Encuentra tu Hogar Ideal con Javer",
  description:
    "Descubre casas en venta en distintas regiones del país. En Javer ofrecemos viviendas accesibles, cómodas y con opciones de financiamiento para tu familia.",
  keywords:
    "casas en venta, Javer, Nuevo León, vivienda en México, crédito Infonavit, desarrollos inmobiliarios",
  openGraph: {
    title: "Encuentra tu nuevo hogar con Javer",
    description:
      "Contamos con espacios para que vivas feliz y en armonía. Visita nuestros desarrollos en todo México.",
    images: [
      {
        url: `${baseUrl}images/thumbnail.webp`,
        width: 1200,
        height: 630,
        alt: "Javer | Más de 50 Años Construyendo Patrimonio para las Familias Mexicanas",
      },
    ],
    url: siteUrl,
    siteName: "Javer",
    type: "website",
  },
};

export const ABOTU_US: Metadata = {
  metadataBase: new URL("https://www.javer.com.mx"),
  alternates: {
    canonical: "https://www.javer.com.mx/nosotros",
  },
  title:
    "JAVER | Más de 50 Años Construyendo Patrimonio para las Familias Mexicanas",
  description:
    "Con más de 50 años de experiencia, JAVER es líder en desarrollos habitacionales en México. Conoce nuestra historia, misión, valores y compromiso con las familias y la sostenibilidad.",
  keywords:
    "Javer, desarrolladora inmobiliaria, vivienda en México, casas en venta, empresa responsable, patrimonio familiar, misión visión valores, sostenibilidad, Great Place to Work",
  openGraph: {
    title: "JAVER | Líder en Vivienda en México por Más de 50 Años",
    description:
      "Descubre la historia, valores y compromiso de JAVER, empresa líder en desarrollos habitacionales sustentables en México",
    images: [
      {
        url: "https://www.javer.com.mx/img/nosotros-og.jpg",
        width: 1200,
        height: 630,
        alt: "Javer | Más de 50 Años Construyendo Patrimonio para las Familias Mexicanas",
      },
    ],
    siteName: "Javer",
    url: "https://www.javer.com.mx/nosotros",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conoce JAVER | 50 Años Construyendo el Futuro de Miles de Familias",
    description:
      "Empresa líder en vivienda social, media y residencial. Presente en 7 estados de México con enfoque sostenible y compromiso social",
    images: [
      {
        url: "https://www.javer.com.mx/img/nosotros-twitter.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const CERT_AND_AWARDS_META: Metadata = {
  metadataBase: new URL("https://www.javer.com.mx"),
  title: "Certificaciones y Premios | JAVER, Empresa Socialmente Responsable",
  description:
    "Descubre los reconocimientos que ha recibido JAVER como empresa comprometida con la ética, sostenibilidad y calidad de vida: GPTW, ESR, CONCAMIN, EDGE y más",
  keywords:
    "Javer, premios Javer, certificaciones Javer, ESR, GPTW, EDGE, CONCAMIN, empresa responsable, sostenibilidad, ética empresarial",
  openGraph: {
    title: "JAVER | Premios y Reconocimientos de una Empresa Comprometida",
    description:
      "JAVER ha sido reconocida por su compromiso social, ambiental y organizacional por entidades como GPTW, CONCAMIN, EDGE y CEMEFI.",
    images: [
      {
        url: "https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/images/media_1732215205707",
        width: 1200,
        height: 630,
        alt: "Javer | Más de 50 Años Construyendo Patrimonio para las Familias Mexicanas",
      },
    ],
    url: "https://www.javer.com.mx/premios-certificaciones",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premios y Certificaciones | JAVER",
    description:
      "Orgullosamente reconocidos por 8 años como GPTW y ESR, JAVER reafirma su compromiso con la sostenibilidad, ética empresarial y calidad en la vivienda.",
    images: [
      {
        url: "https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/images/media_1732215205707",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.javer.com.mx/premios-certificaciones",
  },
};
