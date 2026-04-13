import NotFound from "@/app/not-found";
import {
  Ciudade,
  LocationHierarchy,
  Proyecto,
} from "@/models/location_hierarchy";
import {
  getInitialDataDesarrollos,
  getProjectByID,
  getProjects,
  getPropertiesSearch,
  getPropertyById,
  getTitlesBySection,
} from "@/utils/api";
import { toUpperCase, toUrlCase } from "@/utils/common.utils";
import { buildPropertyMeta } from "@/utils/dynamicMetaTags";
import PropertyPage from "@/views/PropertyPage";
import { Metadata } from "next";
import { cache } from "react";

const getPageData = cache(
  async (name: string, propertyName: string, showHidden: boolean) => {
    const projectSlug = toUpperCase(toUrlCase(decodeURI(name)));
    const propertySlug = toUpperCase(toUrlCase(decodeURI(propertyName)));

    const [projects, states] = await Promise.all([
      getProjects(showHidden),
      getInitialDataDesarrollos(),
    ]);

    const projectLite = projects.find((p) => p.short_name === projectSlug);

    if (!projectLite?.id) {
      return null;
    }

    const [projectData, propertiesList] = await Promise.all([
      getProjectByID(projectLite.id, showHidden),
      getPropertiesSearch({ projectId: projectLite.id, showHidden }),
    ]);

    if (!projectData || !propertiesList) return null;

    const propertyFind = propertiesList.find(
      (p: any) => p.name.toUpperCase() === propertySlug
    );

    if (!propertyFind?.id) return null;

    const [propertyFullData, propertyTitles] = await Promise.all([
      getPropertyById(propertyFind.id, showHidden),
      getTitlesBySection(`property_${propertyFind.id}`),
    ]);



    const state = states.find((s: LocationHierarchy) =>
      s.ciudades?.some((city: Ciudade) =>
        city.proyectos?.some((p: Proyecto) => p.id === projectLite.id)
      )
    );

    return {
      projectData,
      propertyFullData,
      propertyTitles,
      states,
      stateName: state?.name,
      hasUrgencyChip: propertyFind.has_urgency_chip ?? false,
    };
  }
);

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ name: string; propertyName: string }>;
  searchParams?: Promise<{ show_invisible?: string }>;
}): Promise<Metadata> {
  const { name, propertyName } = await params;
  const search = await searchParams;
  const showHidden = search?.show_invisible === "true";

  const data = await getPageData(name, propertyName, showHidden);

  const defaultMeta = {
    title: "Propiedad | Derex",
    description: "Modelo de vivienda en un desarrollo de Derex en México...",
  };

  if (!data || !data.projectData || !data.propertyFullData) {
    return defaultMeta;
  }

  try {
    return buildPropertyMeta({
      project: data.projectData,
      property: data.propertyFullData,
      stateName: data.stateName,
    });
  } catch (error) {
    return defaultMeta;
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string; propertyName: string }>;
  searchParams?: Promise<{ show_invisible?: string }>;
}) {
  const { name, propertyName } = await params;
  const search = await searchParams;
  const showHidden = search?.show_invisible === "true";

  const data = await getPageData(name, propertyName, showHidden);

  if (!data || !data.propertyFullData) {
    return <NotFound />;
  }

  const {
    states,
    projectData,
    propertyFullData,
    propertyTitles,
    hasUrgencyChip,
  } = data;

  return (
    <PropertyPage
      urgencyChip={hasUrgencyChip}
      states={states}
      project={projectData}
      data={propertyFullData}
      titles={propertyTitles}
      showHidden={showHidden}
    />
  );
}
