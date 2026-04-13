import { fetchCertificationsPageData } from "@/services/certifications";

import { CERT_AND_AWARDS_META } from "@/utils/metaTags";
import CertificationPage from "@/views/CertificationPage";

export const metadata = CERT_AND_AWARDS_META;

export default async function Page() {
  try {
    const { websiteMedia, homeTitles, certifications } =
      await fetchCertificationsPageData();

    // Usar imagen por defecto si no existe certs_image
    const mediaToUse = websiteMedia || {
      key: "certs_image",
      value: "https://www.javer.com.mx/images/website/home.webp",
      alt_text: "Certificaciones y premios",
    };

    return (
      <CertificationPage
        websiteMedia={mediaToUse}
        certificationTitles={homeTitles}
        certifications={certifications}
      />
    );
  } catch (error) {
    console.error("Error en la página de certificaciones:", error);
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        Error al cargar la información de certificaciones.
      </div>
    );
  }
}
