import { getMedia, getTitlesBySection } from "@/utils/api";
import ReservasPage from "@/views/Reservas";
import NotFound from "../not-found";
import { WebsiteMedia } from "@/models/website_media";

export default async function Page() {
  const homeTitles = await getTitlesBySection("home");
  const websiteMedia = await getMedia();

  const lotesMedia = websiteMedia.find(
    (media: WebsiteMedia) => media.key === "reservas_image"
  );

  if (!homeTitles && !lotesMedia) {
    return <NotFound />;
  }
  return <ReservasPage homeTitles={homeTitles} websiteMedia={lotesMedia} />;
}
