"use client";
import "@/i18n";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AdditionalInfoSection } from "@/components/AdditionalInfoSection";
import { PropertyArchitecturalPlants } from "@/components/housing-development/property/sections/PropertyArchitecturalPlants";
import { PropertyFeatures } from "@/components/housing-development/property/sections/PropertyFeatures";
import { PropertyHeader } from "@/components/housing-development/property/sections/PropertyHeader";
import { DynamicBreadcrumb } from "@/components/shared/DynamicBreadcrumb";
import { Gallery } from "@/components/ui/Gallery";
import { toUrlCase } from "@/utils/common.utils";
import { Interweave } from "interweave";

import { DevelopmentContactForm } from "@/components/DevelopmentContactForm";
import { SnackbarUrgency } from "@/components/shared/SnackbarUrgency";
import { LocationHierarchy } from "@/models/location_hierarchy";
import { Project } from "@/models/project";
import { Property } from "@/models/property";
import { Icon } from "@iconify/react";

interface PropertyPageProps {
  project: Project;
  data: Property;
  titles: any;
  states: LocationHierarchy[];
  showHidden?: boolean;
  urgencyChip: boolean;
}

export default function PropertyPage({
  project,
  data,
  titles,
  states,
  showHidden,
  urgencyChip,
}: PropertyPageProps) {
  const { t, i18n } = useTranslation("translations");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const state = useMemo(
    () =>
      states?.find((state) =>
        state.ciudades.find((city) =>
          city.proyectos.find((p) => p.id === project.id),
        ),
      ),
    [states, project],
  );

  const lowestPrice = useMemo(() => {
    if (!data?.precios?.length) return 0;
    return Math.min(...data.precios.map((p) => p.price_base));
  }, [data?.precios]);

  return (
    <div>
      <DynamicBreadcrumb
        className="pl-4 py-4 font-bold font-roboto"
        overrides={{
          desarrollos: {
            label: t("developments"),
            href: `/estados/${toUrlCase(state?.name ?? "")}`,
          },
          [toUrlCase(project?.short_name ?? "")]: {
            label: project?.name ?? "",
          },
          [toUrlCase(data?.name ?? "")]: {
            label: data?.name ?? "",
          },
        }}
      />

      {data && (
        <PropertyHeader
          project={project}
          property={data}
          lowestPrice={lowestPrice}
        />
      )}

      <PropertyFeatures property={data} propertyTitles={titles} />

      {data.additional_info && (
        <AdditionalInfoSection info={data?.additional_info} />
      )}

      <PropertyArchitecturalPlants property={data} propertyTitles={titles} />

      {data?.virtual_tour_iframe && (
        <section className="container xl:max-w-5xl mx-auto mt-16">
          <h4
            className={`${titles?.prototypes_virtualTour?.className} font-display text-4xl`}
          >
            {i18n.language === "en"
              ? titles?.prototypes_virtualTour?.value_en
              : titles?.prototypes_virtualTour?.value}
          </h4>
          <hr className="my-6 border-primary" />

          {mounted ? (
            <Interweave
              allowList={["iframe"]}
              className="w-full aspect-video"
              content={data.virtual_tour_iframe}
            />
          ) : null}
        </section>
      )}

      <section id="gallery-section" className="pt-8">
        <Gallery
          priority={true}
          images={data?.extra_images
            ?.sort((a, b) => a.order - b.order)
            ?.map((image: any) => ({
              url: image.url,
              alt: image.alt_text,
            }))}
        />
      </section>

      <section
        id="contact-section"
        className="container mx-auto my-16 px-4"
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl lg:text-4xl">
            {t("housingDevelopmentContactTitle")}
          </h3>
          <h1 className="text-primary mt-1 text-3xl lg:text-5xl">{data?.name}</h1>
          <p className="text-slate-600 mt-2 break-words w-full overflow-hidden">
            {t("housingDevelopmentContactDescription")}
          </p>
          <hr className="my-6 border-primary" />
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div className="flex flex-row gap-4 items-center">
              <Icon
                icon="heroicons-outline:phone"
                width="28"
                className="text-primary"
              />
              <div>
                <p>{t("contact")}</p>
                <strong>{project.contact_form?.phone_number}</strong>
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Icon
                icon="heroicons-outline:clock"
                width="28"
                className="text-primary"
              />
              <div>
                <p>{t("attentionHours")}</p>
                <strong>
                  {i18n.language === "es"
                    ? project.contact_form.opening_hours.es
                    : project.contact_form.opening_hours.en}
                </strong>
              </div>
            </div>
          </div>
          <DevelopmentContactForm development={project} />
        </div>
      </section>

      {urgencyChip && <SnackbarUrgency idProperty={data.id} />}
    </div>
  );
}
