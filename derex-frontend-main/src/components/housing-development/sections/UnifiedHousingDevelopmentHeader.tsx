"use client";
import { DevelopmentOrientationIcon } from "@/components/icons/DevelopmentOrientationIcon";
import { MapIcon } from "@/components/icons/MapIcon";
import { PresaleExpandableBadge } from "@/components/PresaleExpandableBadge";
import i18n from "@/i18n";
import { type Project } from "@/models/project";
import { type Property } from "@/models/property";
import { type PropertySearch } from "@/models/property_search";
import { getTitlesBySection } from "@/utils/api";
import { getResourceUrl } from "@/utils/image.utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";

import { HorizontalPricingSection } from "./components/HorizontalPricingSection";
import { VerticalPricingCard } from "./components/VerticalPricingCard";

function renderWithParagraphs(text: string | null | undefined) {
  if (!text) return null;
  return text.split(/\n+/).map((paragraph, index) => (
    <p key={index} className="mb-3 last:mb-0">
      {paragraph}
    </p>
  ));
}

interface UnifiedHousingDevelopmentHeaderProps {
  development?: Project;
  properties?: Property | PropertySearch[];
  lowestPrice?: number;
  orientation?: "horizontal" | "vertical" | "mixed" | "previous";
  showHidden?: boolean;
}

function isImageBackground(url: string | null | undefined) {
  if (!url) return false;

  const cleanUrl = url.split("?")[0].toLowerCase();
  return /\.(png|jpe?g|webp|avif|gif|svg)$/.test(cleanUrl);
}

export function UnifiedHousingDevelopmentHeader({
  development,
  lowestPrice,
  properties,
  orientation = "horizontal",
  showHidden = false,
}: UnifiedHousingDevelopmentHeaderProps) {
  const { t } = useTranslation("translations");
  const isVertical = orientation === "vertical" || orientation === "mixed";

  const { data: projectTitles } = useQuery({
    queryKey: ["getProjectTitles", development?.id],
    queryFn: async () =>
      await getTitlesBySection(`project_${development?.id ?? -1}`),
    enabled: !!development?.id,
  });

  const hasBackgroundMedia = !!development?.video_url?.trim();
  const backgroundMediaIsImage = isImageBackground(development?.video_url);
  const mediaSectionHeightClass = hasBackgroundMedia
    ? "h-64 lg:h-[70vh]"
    : "h-[500px] lg:h-[600px]";

  const defaultImage = "/images/thumbnail.webp";

  const presaleBadgeContent = development?.is_presale ? (
    <PresaleExpandableBadge
      title={
        i18n.language === "es"
          ? projectTitles?.developments_presale?.value
          : projectTitles?.developments_presale?.value_en
      }
      description={
        i18n.language === "es"
          ? projectTitles?.developments_presaleText?.value
          : projectTitles?.developments_presaleText?.value_en
      }
    />
  ) : null;

  return (
    <>
      <section
        className={`relative transition-all duration-300 ease-in overflow-hidden w-full ${mediaSectionHeightClass}`}
      >
        {/* Background Image (Siempre se renderiza como fallback visual detrás del video o si no hay video) */}
        <div className="absolute inset-0 w-full h-full -z-20">
          <Image
            src={defaultImage} // Usa la variable con lógica de fallback
            alt={`Fondo ${development?.name}`}
            fill
            priority={true}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
            quality={85}
          />
        </div>

        {/* Background Image Upload */}
        {hasBackgroundMedia && backgroundMediaIsImage && (
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src={getResourceUrl(development?.video_url) ?? defaultImage}
              alt={`Fondo ${development?.name}`}
              fill
              priority={true}
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
          </div>
        )}

        {/* Video */}
        {hasBackgroundMedia && !backgroundMediaIsImage && (
          <video
            poster="/images/thumbnail.webp"
            className="absolute inset-0 w-full h-full object-cover z-0 bg-black"
            src={getResourceUrl(development?.video_url)}
            autoPlay
            loop
            muted
            playsInline
            width="100%"
            aria-label={`Video del desarrollo ${development?.name}`}
          />
        )}

        {/* Gradient Overlay */}
        {isVertical ? (
          <div className="absolute top-0 left-0 w-full h-full bg-custom-fade pointer-events-none" />
        ) : (
          <div className="frac-gradient" />
        )}

        {/* Content Container */}
        <div
          className={`lg:absolute bottom-0 left-0 w-full flex flex-col gap-8 -mt-16 lg:mt-0 [&>*]:z-20 ${!isVertical ? "lg:items-center" : ""
            }`}
        >
          <div className="flex flex-col gap-8">
            {/* Presale Badge - Desktop Only */}
            <div
              className={`self-start max-lg:container max-lg:hidden ${isVertical ? "px-4 lg:px-8" : "px-8"
                }`}
            >
              {presaleBadgeContent}
            </div>

            {/* Logo + Title + Location */}
            <div
              className={`flex flex-col lg:flex-row lg:items-center gap-6 ${isVertical
                  ? "container"
                  : "max-lg:container container-responsive"
                }`}
            >
              {/* Logo */}
              {development?.logo_color && getResourceUrl(development.logo_color) && (
                <Image
                  width={128}
                  height={128}
                  className="w-32 h-32 bg-white rounded-md object-contain p-2 border"
                  src={getResourceUrl(development.logo_color)!}
                  alt={development?.logo_color_alt_text ?? "Logo del desarrollo"}
                  loading="lazy"
                />
              )}

              <div className="flex flex-col gap-2">
                {/* Title */}
                {isVertical ? (
                  <h1 className="text-3xl lg:text-5xl flex flex-row items-center">
                    <DevelopmentOrientationIcon
                      orientation={development?.type_orientation ?? "vertical"}
                      className="inline-block mr-2"
                      size={48}
                    />
                    {development?.name}
                  </h1>
                ) : (
                  <h1 className="font-bold text-3xl lg:text-5xl">
                    {development?.name}
                  </h1>
                )}

                {/* Location */}
                <div className="flex flex-row gap-2 items-center text-foreground-soft text-xl">
                  <MapIcon size={40} /> <span>{development?.ciudad}</span>-
                  <Link
                    className="underline cursor-pointer"
                    to="location-section"
                    smooth
                  >
                    {t("seeMap")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section
        className={`mt-4 flex flex-col  ${isVertical
            ? "container"
            : "lg:items-center xl:max-w-5xl lg:mx-auto max-lg:container container-responsive"
          }`}
      >
        {/* Presale Badge (mobile) */}
        <div className="md:hidden">{presaleBadgeContent}</div>

        {/* Pricing Section */}
        {isVertical ? (
          <VerticalPricingCard
            development={development}
            properties={properties}
            lowestPrice={lowestPrice}
            showHidden={showHidden}
          />
        ) : (
          <HorizontalPricingSection
            development={development}
            properties={properties}
            lowestPrice={lowestPrice}
          />
        )}

        {/* Long Description */}
        <div className={isVertical ? "mt-8" : "mt-8 lg:container"}>
          {renderWithParagraphs(
            i18n.language === "es"
              ? development?.long_description
              : development?.long_description_eng
          )}
        </div>
      </section>
    </>
  );
}
