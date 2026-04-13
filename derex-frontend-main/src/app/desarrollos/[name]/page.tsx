import NotFound from "@/app/not-found";
import { LocationHierarchy } from "@/models/location_hierarchy";
import { Project } from "@/models/project";
import {
  getInitialDataDesarrollos,
  getProjectByID,
  getProjects,
  getPropertiesSearch,
  getTitlesBySection,
} from "@/utils/api";
import { toUpperCase, toUrlCase } from "@/utils/common.utils";
import { buildDevelopmentMeta } from "@/utils/dynamicMetaTags";
import DevelopmentPage from "@/views/DevelopmentPage";
import { Metadata } from "next";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;

  const showHidden = false;

  let projects: Project[] = [];
  let states: LocationHierarchy[] = [];

  try {
    [projects, states] = await Promise.all([
      getProjects(showHidden),
      getInitialDataDesarrollos(),
    ]);
  } catch {
    return {
      title: "Desarrollo | Derex",
      description:
        "Encuentra viviendas en desarrollos de Derex en México, con diferentes opciones de financiamiento.",
    };
  }

  const projectLite = projects.find((project: Project) => {
    return project.short_name === toUpperCase(toUrlCase(decodeURI(name)));
  });

  if (!projectLite?.id) {
    return {
      title: "Desarrollo no encontrado | Derex",
      description:
        "El desarrollo que buscas no se encontró. Explora más opciones de vivienda en Derex.",
    };
  }

  let dataProject;
  try {
    dataProject = await getProjectByID(projectLite.id, showHidden);
  } catch {
    return {
      title: "Desarrollo | Derex",
      description:
        "Encuentra viviendas en desarrollos de Derex en México, con diferentes opciones de financiamiento.",
    };
  }

  if (!dataProject) {
    return {
      title: "Desarrollo | Derex",
      description:
        "Encuentra viviendas en desarrollos de Derex en México, con diferentes opciones de financiamiento.",
    };
  }

  const state = states.find((state: LocationHierarchy) =>
    state.ciudades?.some((city: any) =>
      city.proyectos?.some((p: any) => p.id === dataProject.id)
    )
  );

  return buildDevelopmentMeta({
    project: dataProject,
    stateName: state?.name,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams?: Promise<{ show_invisible: string | undefined }>;
}) {
  const { name } = await params;
  const search = await searchParams;

  const showHidden = search?.show_invisible === "true";

  let projects = [];
  let states = [];
  try {
    [projects, states] = await Promise.all([
      getProjects(showHidden),
      getInitialDataDesarrollos(),
    ]);
  } catch (error: any) {
    return (
      <div>
        Error al cargar los datos iniciales del desarrollo. {error.message}
      </div>
    );
  }

  const project = projects.find((project: any) => {
    return project.short_name === toUpperCase(toUrlCase(decodeURI(name)));
  });

  const idProject = project?.id;

  if (!project || !idProject) {
    return <NotFound />;
  }

  let projectTitles, dataProject, allPropertiesByProject;

  try {
    [projectTitles, dataProject, allPropertiesByProject] = await Promise.all([
      getTitlesBySection(`project_${idProject}`),
      getProjectByID(idProject),
      getPropertiesSearch({ projectId: idProject, showHidden }),
    ]);
  } catch (_error) {
    return <div>Error al cargar los datos del desarrollo seleccionado.</div>;
  }

  if (!projectTitles || !dataProject || !allPropertiesByProject) {
    return <NotFound />;
  }

  return (
    <>
      <DevelopmentPage
        projects={projects}
        states={states}
        projectTitles={projectTitles}
        dataProject={dataProject}
        allProperties={allPropertiesByProject}
        showHidden={showHidden}
      />
    </>
  );
}
