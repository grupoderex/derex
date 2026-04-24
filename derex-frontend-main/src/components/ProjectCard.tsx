"use client";

import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

import { type Proyecto } from "@/models/location_hierarchy";
import { type ProjectByFilters } from "@/models/project_by_filters_result";
import {
  getAmenitiesByProjectId,
  getProjectByID,
  getPropertiesSearch,
} from "@/utils/api";
import { toUrlCase } from "@/utils/common.utils";
import { getResourceUrl } from "@/utils/image.utils";

import { PresaleBadge } from "../components/PresaleBadge";
import { Chip } from "../components/shared/Chip";
import { PromotionTag } from "../components/shared/PromotionTag";
import { Gallery, ImageObject } from "../components/ui/Gallery";
import { DevelopmentOrientationIcon } from "./icons/DevelopmentOrientationIcon";
import { EdgeLogo } from "./icons/EdgeLogo";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  project?: Proyecto | ProjectByFilters;
  isGalleryEnabled?: boolean;
  isSelected?: boolean;
  priority?: boolean;
}

function ProjectCardBase({
  project: initialProject,
  isGalleryEnabled = true,
  isSelected = false,
  className,
  priority = false,
  ...props
}: ProjectCardProps) {
  const [openMenuResponsive, setOpenMenuResponsive] = useState(false);


  const { t, i18n } = useTranslation("translations");
  const navigate = useRouter();

  const projectId = useMemo(
    () =>
      initialProject
        ? "project_id" in initialProject
          ? initialProject.project_id
          : initialProject.id
        : undefined,
    [initialProject]
  );

  const { data: project } = useQuery({
    queryKey: ["getProjectByID", projectId],
    queryFn: async () => await getProjectByID(Number(projectId)),
    enabled: !!projectId,
  });

  const projectName = useMemo(() => {
    if (project) return project.name;
    if (!initialProject) return "";

    return "project_id" in initialProject
      ? initialProject.project_name
      : initialProject?.name;
  }, [project, initialProject]);

  const { data: properties } = useQuery({
    queryKey: ["getPropertiesSearch", projectId],
    queryFn: async () =>
      await getPropertiesSearch({ projectId: projectId ?? -1 }),
    enabled: !!projectId,
  });

  const { data: amenitiesImagesData } = useQuery({
    queryKey: ["getAmenitiesByProjectId", projectId, "image"],
    queryFn: async () =>
      await getAmenitiesByProjectId(projectId ?? -1, "image"),
  });

  const { data: amenitiesText } = useQuery({
    queryKey: ["getAmenitiesByProjectId", projectId, "text"],
    queryFn: async () => await getAmenitiesByProjectId(projectId ?? -1, "text"),
  });

  // Calculamos el precio más bajo
  const lowestPrice = useMemo(() => {
    if (!properties || properties.length === 0) return undefined;

    return properties.reduce((globalMin, property) => {
      const propertyMin = property.precios.reduce(
        (pMin, price) => (price.price_base < pMin ? price.price_base : pMin),
        property.precios[0]?.price_base ?? Infinity
      );
      return propertyMin < (globalMin ?? Infinity) ? propertyMin : globalMin;
    }, undefined as number | undefined);
  }, [properties]);

  // Formateamos las imágenes para la galería (renombrado para evitar conflicto)
  const formattedAmenityImages = useMemo(() => {
    return (amenitiesImagesData?.amenities ?? [])
      .map((amenity) => ({
        url: amenity.img_url,
        alt: amenity.img_alt_text,
      }))
      .filter((img): img is ImageObject => !!img.url);
  }, [amenitiesImagesData]);

  const shownAmenities = useMemo(() => {
    return amenitiesText?.amenities?.slice(0, 3);
  }, [amenitiesText]);

  function handleTextClick(event: React.MouseEvent<HTMLParagraphElement>) {
    event.stopPropagation();
    setOpenMenuResponsive(() => !openMenuResponsive);
  }

  // URL segura para redirección
  const projectUrl = `/desarrollos/${toUrlCase(project?.short_name ?? "")}`;
  const projectLogoUrl =
    getResourceUrl(project?.logo_color ?? initialProject?.logo_color ?? "") ||
    "/images/image-default-test.png";

  return (
    <Card
      {...props}
      className={`cursor-pointer rounded-2xl ${isSelected ? "border-primary" : ""
        } ${className} border-none shadow-card`}
      onClick={() => navigate.push(projectUrl)}
    >
      <CardContent className="flex flex-col lg:flex-row gap-8 items-stretch p-0 relative">
        {/* GALERÍA CAROUSEL */}
        {isGalleryEnabled &&
          ((formattedAmenityImages?.length ?? 0) > 0 || project?.thumbnail) && (
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()} // Previene navegación al hacer click en flechas del carrusel si no son manejadas
              onDrag={(e) => e.stopPropagation()}
            >
              <Gallery
                type="carousel"
                priority={priority}
                autoWidth={false}
                isHoverable={false}
                onClick={() => navigate.push(projectUrl)}
                classNames={{
                  ROOT: "lg:w-80 w-full",
                  // Aquí definimos la altura explícita (h-64) que necesita HoverableImage
                  Image: "h-64 rounded-t-xl lg:rounded-r-2xl",
                  Carousel: {
                    Content: "mx-0",
                    Item: "p-0",
                    Previous: "left-1 rounded-[24px]",
                    Next: "right-1 rounded-[24px]",
                  },
                }}
                images={[
                  ...(project?.thumbnail
                    ? [
                      {
                        url: project.thumbnail,
                        alt: project.thumbnail_alt_text,
                      },
                    ]
                    : []),
                  ...(formattedAmenityImages ?? []),
                ]}
              />

              {/* Logo superpuesto en móvil */}
              {project?.logo_color && (
                <Image
                  width={96}
                  height={96}
                  loading="lazy"
                  className="absolute w-24 h-24 lg:h-full bg-white rounded-md object-contain lg:p-2 border lg:hidden block bottom-2 left-2 z-10"
                  src={projectLogoUrl}
                  alt={project?.logo_color_alt_text ?? "project-logo"}
                />
              )}
            </div>
          )}

        <div className="flex flex-col gap-1 grow p-4">
          <div className="flex flex-row gap-[0.80rem] h-fit">
            {project?.logo_color && (
              <Image
                priority={priority}
                loading={priority ? undefined : "lazy"}
                width={96}
                height={96}
                className={`w-24 h-24 bg-white rounded-2xl object-contain p-2 border lg:block ${isGalleryEnabled &&
                  ((formattedAmenityImages?.length ?? 0) > 0 || project?.thumbnail)
                  ? "hidden"
                  : ""
                  }`}
                src={projectLogoUrl}
                alt={
                  project?.logo_color_alt_text ??
                  initialProject?.logo_color_alt_text ??
                  "project-logo"
                }
              />
            )}
            <div className="flex flex-col justify-between w-full">
              <div className="flex justify-between gap-2">
                <h4 className="mb-2 font-bold text-xl lg:text-3xl">
                  <DevelopmentOrientationIcon
                    orientation={project?.type_orientation ?? "vertical"}
                    className="inline-block mr-2"
                    size={32}
                  />
                  {projectName}
                </h4>
              </div>
              {lowestPrice && lowestPrice > 0 ? (
                <div className="flex flex-row gap-2">
                  <h5 className="text-foreground/70 !text-sm lg:!text-lg font-bold">
                    {t("fromPrice")}
                  </h5>
                  <h5 className="text-primary font-bold text-xl lg:text-3xl">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(lowestPrice)}
                  </h5>
                </div>
              ) : (
                <h5 className="text-primary text-lg lg:text-2xl">
                  {t("contactConsultant")}
                </h5>
              )}
            </div>
          </div>

          <div className="bg-slate-400 w-full h-[1px] opacity-40"></div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-5 flex-wrap">
            {project && project.credit_types.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
                <span className="whitespace-nowrap font-">{t("creditTypes")}</span>
                <div className="flex flex-row items-center gap-2 py-2">
                  {project.credit_types
                    .map((creditName, index) => (
                      <Chip
                        name={creditName}
                        className="bg-slate-300 font-display font-bold"
                        key={index}
                      />
                    ))
                    .slice(0, 2)}

                  <p className="flex font-nunito font-bold">
                    {project.credit_types?.length - 2 > 0
                      ? `+${project.credit_types?.length - 2}`
                      : ""}
                  </p>
                </div>
              </div>
            )}
            {shownAmenities &&
              amenitiesImagesData?.amenities &&
              shownAmenities.length > 0 && (
                <div className="flex flex-row items-center gap-2">
                  <Menubar
                    onClick={handleTextClick}
                    className="border-0 lg:hidden block"
                  >
                    <MenubarMenu>
                      <MenubarTrigger className="bg-white flex flex-row items-center gap-2">
                        <Image
                          className="w-6 h-6"
                          src="/images/iconos/infoAmenities.svg"
                          alt="amenities-icon"
                          width={24}
                          height={24}
                        />
                        <span className="font-">
                          {(i18n.language === "es" ? "Amenidades" : null) ?? ""}
                        </span>
                      </MenubarTrigger>

                      {openMenuResponsive && (
                        <MenubarContent className="p-6 flex flex-col gap-2 bg-white w-[327px] shadow-lg rounded-md z-50">
                          <div className="flex flex-row items-center justify-between">
                            <p className="text-sm lg:text-base flex flex-row gap-2 font-semibold">
                              {t("amenities")}
                            </p>
                          </div>
                          <div className="flex flex-col flex-wrap ml-3">
                            {shownAmenities?.map((amenity, index) => (
                              <ul key={index}>
                                <li className="list-disc w-max text-sm font-">
                                  <MenubarItem>{amenity.name}</MenubarItem>
                                </li>
                              </ul>
                            ))}
                          </div>
                        </MenubarContent>
                      )}
                    </MenubarMenu>
                  </Menubar>

                  <div className="hidden lg:block w-full">
                    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-white flex flex-row items-center gap-2">
                            <Image
                              width={24}
                              height={24}
                              className="w-6 h-6 cursor-pointer"
                              src="/images/iconos/infoAmenities.svg"
                              alt="amenities-icon-tooltip"
                            />
                            <span className="font-">
                              {(i18n.language === "es" ? "Amenidades" : null) ?? ""}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipPortal>
                          <TooltipContent
                            side="top"
                            className="bg-white rounded-md text-sm flex flex-col gap-2 p-4 border shadow-lg"
                          >
                            <div className="flex flex-row items-center justify-between">
                              <p className="text-sm lg:text-base flex flex-row gap-2 font-semibold">
                                {t("amenities")}
                              </p>
                            </div>
                            <div className="flex flex-col flex-wrap ml-3">
                              {shownAmenities?.map((amenity, index) => (
                                <ul key={index}>
                                  <li className="list-disc w-max text-sm font-">
                                    {amenity.name}
                                  </li>
                                </ul>
                              ))}
                            </div>
                          </TooltipContent>
                        </TooltipPortal>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )}
          </div>

          <div className="bg-slate-400 w-full h-[1px] opacity-40 my-2"></div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-evenly">
              {initialProject?.promotion_active === 1 && (
                <PromotionTag projectCard={true} />
              )}
              {!!project?.is_presale && <PresaleBadge />}
              {project?.hasPropertyWithEdgeCertification && <EdgeLogo />}
            </div>
            <div className="flex flex-col items-center gap-2 lg:flex-row lg:items-center lg:justify-end w-full lg:w-auto">
              <Button
                variant="outline"
                className="w-full lg:w-auto text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `${projectUrl}#contact-section`;
                }}
              >
                {t("contactUs")}
                <Icon icon="heroicons-solid:mail" width="24" className="ml-2" />
              </Button>
              <Button asChild variant="ghost" className="w-full lg:w-auto">
                <Link className="text-sm" href={projectUrl}>
                  {t("seeMore")}
                  <Icon
                    icon="heroicons-solid:arrow-right"
                    width="24"
                    className="ml-2"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

export const ProjectCard = memo(ProjectCardBase, (prev, next) => {
  return (
    prev.isGalleryEnabled === next.isGalleryEnabled &&
    prev.isSelected === next.isSelected &&
    prev.priority === next.priority &&
    prev.className === next.className &&
    prev.project === next.project
  );
});