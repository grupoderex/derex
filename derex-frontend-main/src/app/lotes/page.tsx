import { WebsiteMedia } from "@/models/website_media";
import { getMedia, getTitlesBySection } from "@/utils/api";
import LotesPage from "@/views/Lotes";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const [websiteMedia, homeTitles] = await Promise.all([
      getMedia(),
      getTitlesBySection("home"),
    ]);

    const lotesMedia = websiteMedia.find(
      (media: WebsiteMedia) => media.key === "lotes_image"
    );

    if (!lotesMedia) {
      throw new Error("No se encontró la imagen de lotes (lotes_image)");
    }

    return <LotesPage homeTitles={homeTitles} websiteMedia={lotesMedia} />;
  } catch (error) {
    console.error("Error al cargar la página de Lotes:", error);
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        Error al cargar la información de Lotes.
      </div>
    );
  }
}
