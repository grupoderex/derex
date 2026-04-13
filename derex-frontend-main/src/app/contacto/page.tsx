import "@/assets/styles/Contacto.css";
import { getProjects, getTitlesBySection } from "@/utils/api";
import ContactPage from "@/views/Contacto";

export const dynamic = "force-dynamic";

export default async function Page() {
  const homeTitles = await getTitlesBySection("home");
  const projects = await getProjects().catch(() => []);
  return (
    <div className="max-w-[778px] mx-auto">
      <ContactPage homeTitles={homeTitles} projects={projects} />
    </div>
  );
}
