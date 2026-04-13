import { type ProjectByFilters } from "@/models/project_by_filters_result";
import {
  getAmenitiesByProjectId,
  getProjectByID,
  getPropertiesSearch,
} from "@/utils/api";
import { toUrlCase } from "@/utils/common.utils";
import { getResourceUrl } from "@/utils/image.utils";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface MapProjectInfoProps {
  project?: ProjectByFilters;
  onClose?: () => void;
}

export function MapProjectInfo({ project, onClose }: MapProjectInfoProps) {
  const { t } = useTranslation("translations");

  const { data: projectData } = useQuery({
    queryKey: ["getProjectByID", project?.project_id],
    queryFn: async () => await getProjectByID(project?.project_id ?? -1),
    enabled: !!project?.project_id,
  });

  const { data: properties } = useQuery({
    queryKey: ["getPropertiesSearch", project?.project_id],
    queryFn: async () =>
      await getPropertiesSearch({ projectId: project?.project_id ?? -1 }),
    enabled: !!project?.project_id,
  });

  const { data: amenities } = useQuery({
    queryKey: ["getAmenitiesByProjectId", project?.project_id],
    queryFn: async () =>
      await getAmenitiesByProjectId(project?.project_id ?? -1, "image"),
    enabled: !!project?.project_id,
  });

  const lowestPrice = useMemo(
    () =>
      properties?.reduce((acc, property) => {
        if (acc === undefined) {
          acc = property.precios.reduce(
            (acc, price) => (price.price_base < acc ? price.price_base : acc),
            property.precios[0]?.price_base
          );
        }

        return property.precios.reduce(
          (acc, price) => (price.price_base < acc ? price.price_base : acc),
          acc
        );
      }, undefined as number | undefined),
    [properties]
  );

  const amenityImages = useMemo(() => {
    return amenities?.amenities
      .map((amenity) => amenity.img_url)
      .filter((img): img is string => !!img);
  }, [amenities]);

  const hasAmenities = useMemo(
    () => (amenityImages?.length ?? 0) > 0,
    [amenityImages]
  );

  return (
    <Card className="rounded w-72 z-50">
      <CardHeader className="flex flex-row justify-end">
        <Icon
          icon="heroicons-solid:x"
          width="16"
          onClick={onClose}
          className="cursor-pointer"
        />
      </CardHeader>
      <CardContent>
        <div className={`relative ${hasAmenities ? "h-64" : "h-20"}`}>
          <Carousel>
            <CarouselContent>
              {amenityImages?.map((amenity, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-64 w-full aspect-square">
                    <Image
                      src={getResourceUrl(amenity)!}
                      alt={`Amenidad del proyecto ${project?.project_name}`}
                      fill
                      className="object-cover"
                      sizes="288px"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className={hasAmenities ? "right-1" : "hidden"} />
            <CarouselPrevious className={hasAmenities ? "left-1" : "hidden"} />
          </Carousel>

          <div
            className={`absolute bottom-2 left-2 w-24 h-24 bg-white rounded-md p-2 border lg:block ${
              hasAmenities ? "hidden" : ""
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={getResourceUrl(project?.logo_color)!}
                alt={project?.project_name ?? "Logo Proyecto"}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
          </div>
        </div>
        <Link href={`/desarrollos/${toUrlCase(projectData?.short_name ?? "")}`}>
          <h6>{project?.project_name}</h6>
          {lowestPrice && lowestPrice > 0 ? (
            <div className="flex flex-row gap-2 mt-2">
              <h6 className="text-foreground/70 !text-sm lg:!text-base">
                {t("fromPrice")}
              </h6>
              <h6 className="text-primary">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(lowestPrice)}
              </h6>
            </div>
          ) : (
            <h6 className="text-primary">{t("contactConsultant")}</h6>
          )}
        </Link>
      </CardContent>
    </Card>
  );
}
