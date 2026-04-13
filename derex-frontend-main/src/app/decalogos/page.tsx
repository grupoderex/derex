import {
  getDecalogues,
  getTitlesBySection,
  getWebsiteMedia,
} from "@/utils/api";
import DecaloguePage from "@/views/Decalogue";

export const dynamic = "force-dynamic";

export default async function Page() {
  const websiteMedia = await getWebsiteMedia();
  const homeTitles = await getTitlesBySection("home");
  const { data } = await getDecalogues("decalogue");

  return (
    <DecaloguePage
      websiteMedia={websiteMedia}
      homeTitles={homeTitles}
      decalogueData={data}
    />
  );
}
