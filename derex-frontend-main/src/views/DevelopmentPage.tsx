"use client";
import { AdditionalInfoSection } from "@/components/AdditionalInfoSection";
import { DevelopmentContactForm } from "@/components/DevelopmentContactForm";
import { GridList } from "@/components/GridList";
import { HousingDevelopmentAmenities } from "@/components/housing-development/sections/HousingDevelopmentAmenities";
import { HousingDevelopmentLocation } from "@/components/housing-development/sections/HousingDevelopmentLocation";
import { UnifiedHousingDevelopmentHeader } from "@/components/housing-development/sections/UnifiedHousingDevelopmentHeader";
import { DynamicBreadcrumb } from "@/components/shared/DynamicBreadcrumb";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toUrlCase } from "@/utils/common.utils";
import { getResourceUrl } from "@/utils/image.utils";
import { Interweave } from "interweave";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { PopUpPromotion } from "@/components/shared/PopUpPromotion";
import { Button } from "@/components/ui/button";
import { LocationHierarchy } from "@/models/location_hierarchy";
import { Project } from "@/models/project";
import { PropertySearch } from "@/models/property_search";
import { Icon } from "@iconify/react";
import Image from "next/image";

import dynamic from "next/dynamic";

const VerticalHousingDevelopmentModels = dynamic(() =>
  import("@/components/housing-development/sections/VerticalHousingDevelopmentModels").then(
    (mod) => mod.VerticalHousingDevelopmentModels,
  ),
);
const HousingDevelopmentModels = dynamic(() =>
  import("@/components/housing-development/sections/HousingDevelopmentModels").then(
    (mod) => mod.HousingDevelopmentModels,
  ),
);

interface DevelopmentPageProps {
  projects: Project[];
  states: LocationHierarchy[];
  projectTitles: any;
  dataProject: Project;
  allProperties: PropertySearch[];
  showHidden: boolean;
}

export default function DevelopmentPage({
  projects,
  states,
  projectTitles,
  dataProject,
  allProperties,
  showHidden,
}: DevelopmentPageProps) {
  const { t, i18n } = useTranslation("translations");
  const [mounted, setMounted] = useState(false);

  const renderWithCommaBreaks = (value?: string | null) => {
    if (!value) return null;

    const chunks = value
      .split(",")
      .map((chunk) => chunk.trim())
      .filter(Boolean);

    if (chunks.length <= 1) return value;

    return chunks.map((chunk, index) => (
      <span key={`${chunk}-${index}`} className="block">
        {chunk}
        {index < chunks.length - 1 ? "," : ""}
      </span>
    ));
  };

  const [showPromotionalBanner, setShowPromotionalBanner] = useState(false);
  const [showMixedModels, setShowMixedModels] = useState<
    "vertical" | "horizontal"
  >("vertical");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 1000);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const state = useMemo(
    () =>
      states?.find((state) =>
        state.ciudades.find((city) =>
          city.proyectos.find((project) => project.id === dataProject.id),
        ),
      ),
    [states, dataProject],
  );

  const lowestPrice = useMemo(
    () =>
      allProperties?.reduce(
        (acc, property) => {
          if (acc === undefined) {
            acc = property.precios.reduce(
              (acc, price) => (price.price_base < acc ? price.price_base : acc),
              property.precios[0]?.price_base,
            );
          }

          return property.precios.reduce(
            (acc, price) => (price.price_base < acc ? price.price_base : acc),
            acc,
          );
        },
        undefined as number | undefined,
      ),
    [allProperties],
  );

  useEffect(() => {
    if (dataProject) {
      setShowPromotionalBanner(!!dataProject.banner_url);
    }
  }, [dataProject]);

  const mixedModelActions = (["vertical", "horizontal"] as const).map((d) => (
    <Button
      key={d}
      className={`bg-neutral-300/20 text-neutral-700 px-4 py-3 ${
        showMixedModels === d
          ? "bg-primary/20 text-primary border-b-2 border-primary"
          : ""
      }`}
      onClick={() => {
        setShowMixedModels(d);
      }}
      variant="ghost"
    >
      {t(d)}
    </Button>
  ));

  return (
    <div>
      <Dialog
        open={showPromotionalBanner}
        onOpenChange={setShowPromotionalBanner}
      >
        <DialogContent className="max-w-4xl p-0 border-none overflow-hidden [&>button]:bg-white">
          <DialogTitle className="sr-only">Banner promocional</DialogTitle>
          {dataProject?.banner_url &&
            getResourceUrl(dataProject.banner_url) && (
              <Image
                src={getResourceUrl(dataProject.banner_url)!}
                alt="Banner promocional"
                width={1000}
                height={1000}
              />
            )}
        </DialogContent>
      </Dialog>
      <DynamicBreadcrumb
        className="pl-4 py-4 font-bold font-roboto"
        overrides={{
          desarrollos: {
            label: t("developments"),
            href: `/estados/${toUrlCase(state?.name ?? "")}`,
          },
          [toUrlCase(dataProject?.short_name ?? "")]: {
            label: dataProject?.name ?? "",
          },
        }}
      />
      <UnifiedHousingDevelopmentHeader
        development={dataProject}
        properties={allProperties}
        lowestPrice={lowestPrice}
        orientation={dataProject?.type_orientation}
        showHidden={showHidden}
      />

      <HousingDevelopmentAmenities projectId={dataProject.id} />

      {dataProject?.type_orientation === "mixed" && (
        <div>
          {showMixedModels === "vertical" ? (
            <VerticalHousingDevelopmentModels
              properties={allProperties}
              project={dataProject}
              actions={mixedModelActions}
              showHidden={showHidden}
            />
          ) : (
            <HousingDevelopmentModels
              properties={allProperties}
              project={dataProject}
              actions={mixedModelActions}
              showHidden={showHidden}
            />
          )}
        </div>
      )}

      {allProperties &&
        allProperties.length > 0 &&
        (dataProject?.type_orientation === "vertical" ? (
          <VerticalHousingDevelopmentModels
            properties={allProperties}
            project={dataProject}
            showHidden={showHidden}
          />
        ) : dataProject?.type_orientation === "horizontal" ? (
          <HousingDevelopmentModels
            properties={allProperties}
            project={dataProject}
            showHidden={showHidden}
          />
        ) : (
          <></>
        ))}

      {dataProject?.additional_info &&
        Object.keys(dataProject.additional_info).length > 0 && (
          <AdditionalInfoSection info={dataProject.additional_info} />
        )}

      {(!!dataProject?.live_the_experience_description ||
        dataProject?.live_the_experience_url) && (
        <section className="container w-screen lg:w-full  xl:max-w-5xl mx-auto mt-16">
          <h3 className="font-bold">{t("liveTheFullExperience")}</h3>
          <hr className="my-6 border-primary" />
          {dataProject?.live_the_experience_description && (
            <p className="mb-6">
              {i18n.language === "es"
                ? dataProject?.live_the_experience_description
                : dataProject?.live_the_experience_description_en}
            </p>
          )}
          {dataProject?.live_the_experience_url && (
            <>
              {mounted ? (
                <Interweave
                  allowList={["iframe"]}
                  content={dataProject?.live_the_experience_url}
                  className="w-full aspect-video"
                />
              ) : null}
            </>
          )}
        </section>
      )}

      {dataProject?.interest_area &&
        (dataProject.interest_area.sp?.length ?? 0) > 0 &&
        (dataProject.interest_area.en?.length ?? 0) > 0 && (
          <section className="container xl:max-w-5xl mx-auto mt-16">
            <h3
              className={`${projectTitles?.developments_interestZones?.className} font-bold`}
            >
              {i18n.language === "en"
                ? projectTitles?.developments_interestZones?.value_en
                : projectTitles?.developments_interestZones?.value}
            </h3>
            <hr className="my-6 border-primary" />
            <GridList
              items={
                i18n.language === "es"
                  ? dataProject.interest_area.sp
                  : dataProject.interest_area.en
              }
            />
          </section>
        )}

      {dataProject?.equipment &&
        (dataProject.equipment.sp?.length ?? 0) > 0 &&
        (dataProject.equipment.en?.length ?? 0) > 0 && (
          <section className="container xl:max-w-5xl mx-auto mt-16">
            <h3
              className={`${projectTitles?.developments_equipment?.className} font-bold`}
            >
              {i18n.language === "en"
                ? projectTitles?.developments_equipment?.value_en
                : projectTitles?.developments_equipment?.value}
            </h3>
            <hr className="my-6 border-primary" />
            <GridList
              items={
                i18n.language === "es"
                  ? dataProject.equipment.sp
                  : dataProject.equipment.en
              }
            />
          </section>
        )}

      {dataProject?.document_url && (
        <div className="bg-neutral-100 py-8 mt-8">
          <div className="container flex flex-col gap-4 max-w-5xl">
            <h3 className="font-bold">{t("brochureDevelopmentTitle")}</h3>
            <p>{t("brochureDevelopmentDescription")} </p>
            <Button className="self-start w-64" asChild>
              <a
                className="flex flex-row gap-2"
                href={`/descargables/${
                  new URL(dataProject?.document_url).pathname
                    .split("/")
                    .pop() ?? ""
                }`}
                target="_blank"
                rel="noreferrer"
              >
                <Icon icon="heroicons-solid:download" width="20" />
                {t("brochureDevelopmentButton")}
              </a>
            </Button>
          </div>
        </div>
      )}

      <HousingDevelopmentLocation project={dataProject} />

      <section
        id="contact-section"
        className="container mx-auto my-16 px-4"
      >
        <div className="max-w-2xl mx-auto">
          <h3
            className={`text-2xl lg:text-4xl ${projectTitles?.developments_developmentContact?.className}`}
          >
            {i18n.language === "en"
              ? projectTitles?.developments_developmentContact?.value_en
              : projectTitles?.developments_developmentContact?.value}
          </h3>
          <h3 className="text-primary mt-1 font-bold text-3xl lg:text-5xl">
            {dataProject?.name}
          </h3>
          <p className="text-slate-600 mt-2 break-words w-full overflow-hidden">
            {i18n.language === "en"
              ? projectTitles?.developments_developmentContactDescription
                  ?.value_en
              : projectTitles?.developments_developmentContactDescription?.value}
          </p>
          <hr className="my-6 border-primary" />
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div className="flex flex-row gap-4 items-center">
              <Icon
                icon="heroicons:phone"
                className="text-primary"
                width="28"
              />
              <div>
                <p>{t("contact")}</p>
                <strong>
                  {renderWithCommaBreaks(dataProject?.contact_form?.phone_number)}
                </strong>
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Icon
                icon="heroicons:clock"
                className="text-primary"
                width="28"
              />
              <div>
                <p>{t("attentionHours")}</p>
                <strong>
                  {renderWithCommaBreaks(
                    i18n.language === "es"
                      ? dataProject?.contact_form?.opening_hours?.es
                      : dataProject?.contact_form?.opening_hours?.en,
                  )}
                </strong>
              </div>
            </div>
          </div>
          <DevelopmentContactForm development={dataProject} />
        </div>
      </section>

      <div className="fixed bottom-0 left-0 lg:bottom-3 lg:left-3 z-30 cursor-pointer">
        {dataProject && <PopUpPromotion idProject={dataProject.id} />}
      </div>
    </div>
  );
}
