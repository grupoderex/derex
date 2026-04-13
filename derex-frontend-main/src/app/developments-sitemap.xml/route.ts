import { getFullDataDesarrollos } from "@/utils/api";
import { toUrlCase } from "@/utils/common.utils";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";

export async function GET() {
  const { data } = await getFullDataDesarrollos();

  const siteUrl = process.env.SITE_URL || "https://example.com";

  const sitemapFields: ISitemapField[] = data.flatMap((estado: any) => {
    // URL del estado
    const estadoUrl: ISitemapField = {
      loc: `${siteUrl}/estados/${toUrlCase(estado.name ?? "")}`,
      lastmod: estado.update_at,
      changefreq: "weekly",
    };

    return [
      estadoUrl,
      // Recorremos las ciudades
      ...(estado.ciudades ?? []).flatMap((ciudad: any) => {
        const ciudadUrl: ISitemapField = {
          loc: `${siteUrl}/estados/${toUrlCase(
            estado.name ?? ""
          )}?zona=${toUrlCase(ciudad.name ?? "all")}`,
          lastmod: ciudad.update_at,
          changefreq: "weekly",
        };

        return [
          ciudadUrl,
          // Recorremos los desarrollos dentro de la ciudad
          ...(ciudad.desarrollos ?? []).flatMap((desarrollo: any) => {
            const desarrolloUrl: ISitemapField = {
              loc: `${siteUrl}/desarrollos/${toUrlCase(
                desarrollo.short_name ?? ""
              )}`,
              lastmod: desarrollo.update_at,
              changefreq: "weekly",
            };

            return [
              desarrolloUrl,
              ...(desarrollo.prototipos ?? []).map((prototipo: any) => ({
                loc: `${siteUrl}/desarrollos/${toUrlCase(
                  desarrollo.short_name ?? ""
                )}/propiedad/${toUrlCase(prototipo.name ?? "")}`,
                lastmod: prototipo.update_at,
                changefreq: "weekly",
              })),
            ];
          }),
        ];
      }),
    ];
  });

  return getServerSideSitemap(sitemapFields);
}
