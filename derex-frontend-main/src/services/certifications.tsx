import {
  getAllCertificationsAndAwards,
  getMedia,
  getTitlesBySection,
} from "@/utils/api";
import { WebsiteMedia } from "@/models/website_media";

export async function fetchCertificationsPageData() {
  try {
    const [media, homeTitles, certifications] = await Promise.all([
      getMedia(),
      getTitlesBySection("certifications"),
      getAllCertificationsAndAwards(),
    ]);

    const websiteMedia = media.find(
      (med: WebsiteMedia) => med.key === "certs_image"
    );

    return {
      websiteMedia,
      homeTitles,
      certifications,
    };
  } catch (error) {
    console.error("Error al obtener datos de certificaciones:", error);
    throw new Error("Error al cargar datos de certificaciones");
  }
}
