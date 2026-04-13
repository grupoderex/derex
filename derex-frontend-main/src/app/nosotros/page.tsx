import { getAllAboutSections, getTitlesBySection } from "@/utils/api";
import { ABOTU_US } from "@/utils/metaTags";
import { AboutUs } from "@/views/Aboutus";

export const metadata = ABOTU_US;
export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const [res, titles] = await Promise.all([
      getAllAboutSections(),
      getTitlesBySection("about-javer"),
    ]);

    return <AboutUs data={res.data} titles={titles} />;
  } catch (error) {
    console.error("Error loading About Us:", error);
    return <div>Error al cargar los datos de About Us.</div>;
  }
}
