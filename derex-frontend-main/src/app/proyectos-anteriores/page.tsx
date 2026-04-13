import { getAmenitiesByProjectId, getProjects } from "@/utils/api";
import PreviousProjectsPage from "@/views/PreviousProjectsPage";

export default async function Page() {
  try {
    const projects = await getProjects(true);
    const previousProjects = projects.filter(
      (project) => project.type_orientation === "previous"
    );

    const imageEntries = await Promise.all(
      previousProjects.map(async (project) => {
        try {
          const response = await getAmenitiesByProjectId(project.id, "image");
          const images = (response?.amenities ?? [])
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((amenity) => ({
              url: amenity.img_url ?? "",
              alt: amenity.img_alt_text ?? project.name,
            }))
            .filter((image) => !!image.url);
          return [String(project.id), images] as const;
        } catch {
          return [String(project.id), []] as const;
        }
      })
    );

    const projectImagesById = Object.fromEntries(imageEntries);

    return (
      <PreviousProjectsPage
        title="Proyectos anteriores"
        projects={previousProjects}
        projectImagesById={projectImagesById}
      />
    );
  } catch (error) {
    console.error("Error al cargar proyectos anteriores:", error);
    return <PreviousProjectsPage title="Proyectos anteriores" projects={[]} />;
  }
}