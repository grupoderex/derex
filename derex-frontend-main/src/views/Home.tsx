"use client";

import "@/i18n";
import { useTranslation } from "react-i18next";

import { LazyBlogSection } from "@/components/home/LazyBlogSection";
import { LazyContactSection } from "@/components/home/LazyContactSection";
import { LazyFAQSection } from "@/components/home/LazyFAQSection";
// import { LazyReviewsSection } from "@/components/home/LazyReviewsSection";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeoLocation";
import { type LocationHierarchy } from "@/models/location_hierarchy";
import { MetadataTitle, ParsedKnowJaver } from "@/models/metadata";
import { WebsiteMediaObject } from "@/models/website_media";
import { toUrlCase } from "@/utils/common.utils";
import { getResourceUrl } from "@/utils/image.utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HomeSearchBar } from "../components/HomeSearchBar";
import NextLaunchesCarousel from "../components/NextLauchesCarousel";
import { ProjectCard } from "../components/ProjectCard";

interface HomeProps {
  lang: string;
  websiteMedia: WebsiteMediaObject;
  developments: LocationHierarchy[];
  knowJaver: ParsedKnowJaver;
  homeTitles: Record<string, MetadataTitle>;
}

function Home({
  lang,
  websiteMedia,
  developments,
  knowJaver,
  homeTitles,
}: HomeProps) {
  const { t, i18n } = useTranslation("translations");
  const [mounted, setMounted] = useState(false);
  // Geo
  const { coords, requestPosition, permissionStatus } = useGeolocation();

  // 1. Evitar mismatch: Usamos el lang que viene del servidor para el render inicial
  const currentLang = mounted ? i18n.language : lang;

  useEffect(() => {
    setMounted(true);
    requestPosition(false);
  }, [requestPosition]);

  const [selectedState, setSelectedState] = useState<number | null>(() => {
    const initialFeatured = developments.find((d) =>
      d.ciudades.some((c) => c.proyectos.some((p) => p.outstanding === 1))
    );
    return initialFeatured?.id ?? null;
  });

  const nearestState = useMemo(() => {
    if (!developments || !coords) return null;
    return developments.reduce<{
      state: LocationHierarchy;
      distance: number;
    } | null>((prev, curr) => {
      const projects = curr.ciudades.flatMap((c) => c.proyectos);

      const currDistance = projects.reduce((prev, curr) => {
        const distance = Math.sqrt(
          Math.pow(parseFloat(curr.latitud) - coords.lat, 2) +
          Math.pow(parseFloat(curr.longitud) - coords.lon, 2)
        );
        return distance < prev ? distance : prev;
      }, Infinity);

      if (!prev) return { state: curr, distance: currDistance };

      return currDistance < prev.distance
        ? { state: curr, distance: currDistance }
        : prev;
    }, null);
  }, [developments, coords]);

  const featuredDevelopments = useMemo(() => {
    if (!developments) return [];

    return developments
      .filter((d) =>
        d.ciudades.some((c) =>
          c.proyectos.some((p) => p.outstanding === 1 && p.active === 1)
        )
      )
      .map((d) => ({
        ...d,
        ciudades: d.ciudades
          .filter((c) =>
            c.proyectos.some((p) => p.outstanding === 1 && p.active === 1)
          )
          .map((c) => ({
            ...c,
            proyectos: c.proyectos.filter(
              (p) => p.outstanding === 1 && p.active === 1
            ),
          })),
      }));
  }, [developments]);

  const nearestFeaturedState = useMemo(() => {
    if (!featuredDevelopments || !coords)
      return {
        state:
          developments?.find((d) =>
            d.ciudades.some((c) =>
              c.proyectos.some((p) => p.outstanding === 1 && p.active === 1)
            )
          ) ?? null,
        distance: 0,
      };
    return featuredDevelopments.reduce<{
      state: LocationHierarchy;
      distance: number;
    } | null>((prev, curr) => {
      const projects = curr.ciudades.flatMap((c) => c.proyectos);

      const currDistance = projects.reduce((prev, curr) => {
        const distance = Math.sqrt(
          Math.pow(parseFloat(curr.latitud) - coords.lat, 2) +
          Math.pow(parseFloat(curr.longitud) - coords.lon, 2)
        );
        return distance < prev ? distance : prev;
      }, Infinity);

      if (!prev) return { state: curr, distance: currDistance };

      return currDistance < prev.distance
        ? { state: curr, distance: currDistance }
        : prev;
    }, null);
  }, [featuredDevelopments, coords]);

  useEffect(() => {
    if (nearestFeaturedState?.state) {
      setSelectedState(nearestFeaturedState.state.id);
    } else {
      const defaultFeatured = developments.find((d) =>
        d.ciudades.some((c) => c.proyectos.some((p) => p.outstanding === 1))
      );
      setSelectedState(defaultFeatured?.id ?? developments?.[0]?.id ?? null);
    }
  }, [nearestFeaturedState, developments]);

  const homeMediaUrl = websiteMedia?.home_video ?? "";
  const isHomeMediaVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(homeMediaUrl);

  return (
    <div className="mt-[-78px] lg:mt-[-95px] pb-32">
      <div className="relative">
        <div className="absolute inset-0 w-full h-[80vh] lg:h-[70vh] -z-10">
          <Image
            src="/images/thumbnail.webp"
            alt="Fondo Javer"
            fill
            priority={true}
            className="object-cover w-full h-[80vh] lg:h-[70vh]"
            sizes="100vw"
            quality={80}
          />
        </div>
        {homeMediaUrl && isHomeMediaVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            src={homeMediaUrl}
            aria-hidden="true"
            tabIndex={-1}
            className="object-cover w-full h-[80vh] lg:h-[70vh]"
            aria-label="Video de la pagina de inicio"
          />
        ) : null}
        {homeMediaUrl && !isHomeMediaVideo ? (
          <Image
            src={homeMediaUrl}
            alt="Imagen de la pagina de inicio"
            width={1920}
            height={1080}
            className="object-cover w-full h-[80vh] lg:h-[70vh]"
            priority
          />
        ) : null}

        <div className="absolute -bottom-1 h-[80vh] w-full home-gradient" />

        <div className="absolute top-0 h-[80vh] w-full lg:bottom-0 lg:h-[70vh]">
          <div className="container flex lg:items-end items-center justify-center h-full lg:pb-16">
            <div className="relative w-full flex justify-center">
              <HomeSearchBar
                selectedState={nearestState?.state?.name}
                developments={developments}
                homeTitles={homeTitles}
              />

              <div className="absolute top-full left-0 w-full flex justify-center mt-4">
                {(permissionStatus === "prompt" ||
                  permissionStatus === "unknown") && (
                    <Button
                      onClick={() => requestPosition(true)}
                      variant="secondary"
                      className="gap-2 shadow-lg bg-white/90 hover:bg-white text-primary font-bold animate-in fade-in slide-in-from-top-2"
                      size="sm"
                    >
                      <Icon icon="heroicons:map-pin" width="20" />
                      {t("findNearMe") ?? "Ver desarrollos cerca de mí"}
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div id="outstanding-projects" className="absolute bottom-16" />
        <span
          id="outstanding-projects"
          className="absolute bottom-16 block"
          aria-hidden="true"
        />
      </div>

      <NextLaunchesCarousel
        homeTitles={homeTitles}
        nearestState={nearestState}
      />

      <section className="container py-10 max-2xl:max-w-7xl">
        {featuredDevelopments.length > 0 && (
          <>
            <div className="flex flex-col">
              <h3
                className={`text-center font-bold text-[36px] lg:text-4xl leading-8  ${homeTitles?.home_featuredDevelopmentsUp?.className}`}
              >
                {currentLang === "en"
                  ? homeTitles?.home_featuredDevelopmentsUp?.value_en
                  : homeTitles?.home_featuredDevelopmentsUp?.value}
              </h3>
              {/* <h3
                className={`${homeTitles?.home_featuredDevelopmentsDown?.className} ml-16 -mt-5`}
              >
                {currentLang === "en"
                  ? homeTitles?.home_featuredDevelopmentsDown?.value_en
                  : homeTitles?.home_featuredDevelopmentsDown?.value}
              </h3> */}
            </div>

            <div className="flex flex-row gap-2 items-center justify-center mt-10 flex-wrap">
              {featuredDevelopments.map((d) => (
                <Button
                  key={d.id}
                  className={`bg-neutral-300/20 text-neutral-700 px-4 py-3 font-roboto ${selectedState === d.id
                    ? "bg-primary text-white border-b-2 border-primary"
                    : ""
                    }`}
                  onClick={() => {
                    setSelectedState(d.id);
                  }}
                  variant="ghost"
                >
                  {d.name}
                </Button>
              ))}
            </div>
            <div className="flex flex-row justify-center min-h-[280px]">
              <ProjectCard
                className="mt-8 w-[900px] border-none !shadow-card"
                project={featuredDevelopments
                  .find((d) => d.id === selectedState)
                  ?.ciudades?.at(0)
                  ?.proyectos?.at(0)}
              />
            </div>
            <div className="flex flex-row justify-center mt-4">
              <Button className="mt-2 font-roboto" asChild variant="ghost">
                <Link
                  href={`/estados/${toUrlCase(
                    featuredDevelopments.find((d) => d.id === selectedState)
                      ?.name ?? ""
                  )}`}
                >
                  {t("seeTheEntireState")}
                </Link>
              </Button>
            </div>
          </>
        )}
      </section>

      <section
        className={`lg:h-[480px] flex flex-col gap-8 my-8  xl:max-w-[1700px] mx-0 px-8 w-full ${knowJaver?.isImageLeft === "true"
          ? "lg:flex-row"
          : "lg:flex-row-reverse"
          }`}
      >
        <div className="relative lg:w-1/2 h-auto aspect-[16/9]">
          <Image
            src={
              getResourceUrl(knowJaver?.imageUrl) ??
              "/images/home-know-javer.jpg"
            }
            alt={knowJaver?.altText ?? "Imagen Javer"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="lg:w-1/2 flex flex-col items-center">
          <div className="flex flex-row items-center gap-1">
            <h2
              className={`text-[36px] lg:text-5xl font-bold ${knowJaver?.titleUpper?.className}`}
            >
              {i18n.language === "en"
                ? knowJaver?.titleUpper?.value_en
                : knowJaver?.titleUpper?.value}
            </h2>

            <h2
              className={`text-[36px] lg:text-5xl ml-3 font-bold ${knowJaver?.titleLower?.className}`}
            >
              {i18n.language === "en"
                ? knowJaver?.titleLower?.value_en
                : knowJaver?.titleLower?.value}
            </h2>
          </div>
          <div
            className="border-l pl-2 py-4 border-foreground w-full font-arial text-lg"
            dangerouslySetInnerHTML={{
              __html:
                i18n.language === "en"
                  ? knowJaver?.description?.value_en
                  : knowJaver?.description?.value,
            }}
          />
          <Button className="self-start mt-2 font-roboto" asChild>
            <a href={knowJaver?.buttonUrl}>
              {i18n.language === "en"
                ? knowJaver?.buttonText?.value_en
                : knowJaver?.buttonText?.value}
              <Icon
                icon="heroicons-solid:arrow-right"
                width="20"
                className="ml-2"
              />
            </a>
          </Button>
        </div>
      </section>

      {/* <LazyReviewsSection /> */}
      <LazyFAQSection />
      <LazyBlogSection homeTitles={homeTitles} />
      <LazyContactSection />
    </div>
  );
}

export default Home;
