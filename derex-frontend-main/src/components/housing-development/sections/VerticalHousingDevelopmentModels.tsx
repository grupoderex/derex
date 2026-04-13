import { GridList } from "@/components/GridList";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type Project } from "@/models/project";
import { type PropertySearch } from "@/models/property_search";
import { getPropertyById, getUrgencyByPropertyId } from "@/utils/api";
import { toUrlCase } from "@/utils/common.utils";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useWindowSize } from "@uidotdev/usehooks";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModelCard } from "../../../components/ModelCard";
import { SelectableModelCard } from "../../../components/SelectableModelCard";
import { Chip } from "../../../components/shared/Chip";

interface VerticalHousingDevelopmentModelsProps {
  project?: Project;
  properties?: PropertySearch[];
  actions?: React.ReactNode;
  showHidden?: boolean;
}

export function VerticalHousingDevelopmentModels({
  project,
  properties,
  actions,
  showHidden,
}: VerticalHousingDevelopmentModelsProps) {
  const { width } = useWindowSize();
  const { t, i18n } = useTranslation("translations");

  const [eye, setSeEye] = useState(false);
  const [urgencyChip, setUrgencyChip] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<PropertySearch | null>(
    null
  );

  useEffect(() => {
    if (properties && properties.length > 0) {
      setSelectedModel(properties[0]);
    }
  }, [properties]);

  useEffect(() => {
    (async () => {
      if (selectedModel !== null) {
        const chipData = await getUrgencyByPropertyId(selectedModel.id);

        setUrgencyChip(chipData);
      }
    })();
  }, [selectedModel]);

  const lowestPrice = useMemo(
    () =>
      selectedModel?.precios.reduce(
        (acc, price) => (price.price_base < acc ? price.price_base : acc),
        selectedModel.precios?.at(0)?.price_base ?? 0
      ),
    [selectedModel]
  );

  const { data: property } = useQuery({
    queryKey: ["getPropertyById", selectedModel?.id, showHidden],
    queryFn: async () =>
      await getPropertyById(selectedModel?.id ?? -1, showHidden),
    enabled: !!selectedModel?.id,
  });

  if (!properties) {
    return null;
  }

  return (
    <>
      <section
        className="container xl:max-w-5xl mx-auto pt-16"
        id="models-section"
      >
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-2xl lg:text-4xl font-display">
            {t("models")} {project?.name}
          </h3>
          <div className="flex flex-row gap-4">{actions}</div>
        </div>
        <hr className="my-6 border-primary" />
      </section>
      <div className="container xl:max-w-5xl mx-auto flex flex-col sm:items-center md:hidden gap-4">
        {properties?.map((property, index) => (
          <ModelCard
            key={index}
            model={property}
            className="lg:max-sm:w-full"
            projectName={toUrlCase(project?.short_name ?? "")}
            showHidden={showHidden}
          />
        ))}
      </div>
      <Carousel
        opts={{
          dragFree: true,
          align: "center",
        }}
        className="max-md:hidden"
      >
        <CarouselContent
          style={{
            marginLeft: width && width >= 1280 ? (width - 1024) / 2 + 24 : 16,
            marginRight: width && width >= 1280 ? (width - 1024) / 2 + 24 : 16,
          }}
        >
          {properties?.length >= 3 ? (
            <>
              {properties?.map((property, index) => (
                <CarouselItem
                  key={index}
                  className="basis-auto max-w-full min-w-0 pl-4 pb-8"
                >
                  <SelectableModelCard
                    model={property}
                    projectName={toUrlCase(project?.short_name ?? "")}
                    isSelected={selectedModel?.id === property.id}
                    onClick={() => {
                      setSelectedModel(property);
                    }}
                  />
                </CarouselItem>
              ))}
            </>
          ) : (
            <div className="flex flex-row justify-center">
              {properties?.map((property, index) => (
                <CarouselItem
                  key={index}
                  className="basis-auto max-w-full min-w-0 pl-4 pb-8"
                >
                  <SelectableModelCard
                    model={property}
                    projectName={toUrlCase(project?.short_name ?? "")}
                    isSelected={selectedModel?.id === property.id}
                    onClick={() => {
                      setSelectedModel(property);
                    }}
                  />
                </CarouselItem>
              ))}
            </div>
          )}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
      <div className="max-w-[1024px] mx-auto flex flex-col gap-8 max-md:hidden pt-16">
        <div className="flex flex-row justify-between max-w-[960px] mx-auto w-full">
          <div className="flex flex-row gap-8 items-end">
            <h5 className="font-bold text-3xl">{selectedModel?.name}</h5>
            {lowestPrice ? (
              <>
                <h6 className="mt-2 text-2xl ">
                  {t("fromPrice")}:{" "}
                  <span className="font-display font-normal">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(lowestPrice)}
                  </span>
                </h6>
              </>
            ) : (
              <h6 className="mt-2 ">{t("noPrices")}</h6>
            )}

            {urgencyChip?.is_active && (
              <Chip
                name={
                  i18n.language === "es"
                    ? urgencyChip.description_es
                    : urgencyChip.description_en
                }
                className={"bg-error-medium  text-white"}
              />
            )}
          </div>
          <Button asChild variant="outline">
            <Link
              href={`/desarrollos/${toUrlCase(
                project?.short_name ?? ""
              )}/propiedad/${toUrlCase(selectedModel?.name ?? "")}${
                showHidden ? `?show_invisible=${showHidden}` : ""
              }`}
            >
              {t("knowMore")}{" "}
              <Icon icon="heroicons:arrow-right" width="24" className="ml-2" />
            </Link>
          </Button>
        </div>
        {property?.features?.[i18n.language as "es" | "en"] && (
          <div>
            <h6 className="text-foreground-soft mb-4 ">{t("features")}</h6>
            <GridList
              items={property?.features?.[i18n.language as "es" | "en"] ?? []}
            />
          </div>
        )}
        <Link
          href={`/desarrollos/${toUrlCase(
            project?.short_name ?? ""
          )}/propiedad/${toUrlCase(selectedModel?.name ?? "")}${
            showHidden ? `?show_invisible=${showHidden}` : ""
          }`}
        >
          <div
            onMouseEnter={() => setSeEye(true)}
            onMouseLeave={() => setSeEye(false)}
            className="relative w-full max-w-[960px] aspect-video mx-auto cursor-pointer overflow-hidden bg-gray-100"
          >
            {property?.thumbnail && (
              <Image
                src={property.thumbnail}
                alt={property?.name ?? "Propiedad"}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 960px"
                priority={false}
              />
            )}

            <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none z-10">
              {eye && <Icon icon="heroicons-solid:eye" width="32" />}
            </div>

            {eye && (
              <div className="absolute inset-0 bg-black/30 transition-opacity" />
            )}
          </div>
        </Link>
      </div>
    </>
  );
}
