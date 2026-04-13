import { GoogleMapsLogo } from "@/components/icons/GoogleMapsLogo";
import { WazeLogo } from "@/components/icons/WazeLogo";
import { MapErrorBoundary } from "@/components/MapErrorBoundary";
import { Button } from "@/components/ui/button";
import { GOOGLE_MAPS_KEY, SHOULD_LOAD_GOOGLE_MAPS } from "@/constants";
import { type Project } from "@/models/project";
import { getTitlesBySection } from "@/utils/api";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LazyMapWithProvider = dynamic(
  async () => {
    const [modMap, { APIProvider }] = await Promise.all([
      import("@/components/HousingMapWrapper"),
      import("@vis.gl/react-google-maps"),
    ]);

    const HousingMapWrapper = modMap.default || modMap;

    return function MapComponentWithProvider(props: any) {
      return (
        <APIProvider apiKey={GOOGLE_MAPS_KEY ?? ""}>
          <HousingMapWrapper {...props} />
        </APIProvider>
      );
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-neutral-100 animate-pulse flex flex-col items-center justify-center text-neutral-400 gap-2">
        <Icon icon="heroicons:map" width="32" />
        <span className="text-sm">Cargando ubicación...</span>
      </div>
    ),
  }
);

interface HousingDevelopmentLocationProps {
  project?: Project;
}

export function HousingDevelopmentLocation({
  project,
}: HousingDevelopmentLocationProps) {
  const { t, i18n } = useTranslation("translations");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    if (isMapVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => observer.disconnect();
  }, [isMapVisible]);

  const { lat, lng } = useMemo(() => {
    if (!project) return {};

    const lat = parseFloat(project.latitud);
    const lng = parseFloat(project.longitud);

    if (isNaN(lat) || isNaN(lng) || lat === 0.0 || lng === 0.0) return {};

    return {
      lat,
      lng,
    };
  }, [project]);

  const { data: projectTitles } = useQuery({
    queryKey: ["getProjectTitles", project?.id],
    queryFn: async () =>
      await getTitlesBySection(`project_${project?.id ?? -1}`),
    enabled: !!project?.id,
  });

  return (
    <>
      <section
        className="container xl:max-w-5xl mx-auto pt-16"
        id="location-section"
      >
        <h3
          className={
            projectTitles?.developments_location?.className + "font-bold"
          }
        >
          {i18n.language === "en"
            ? projectTitles?.developments_location?.value_en
            : projectTitles?.developments_location?.value}
        </h3>
        <p className="mt-2">
          {project?.calle}, {project?.colonia}, {project?.cp}, {project?.ciudad}
          .
        </p>
        <hr className="my-6 border-primary" />
        {(!!project?.link_map || project?.wase_link_map) && (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 justify-center items-center mb-8">
            <div>{t("howToGetHere")}</div>
            {project?.link_map && (
              <Button variant="maps">
                <a
                  href={project?.link_map}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center"
                >
                  <GoogleMapsLogo size={12} className="mr-2" />
                  {t("continueInGoogleMaps")}
                </a>
              </Button>
            )}
            {project?.wase_link_map && (
              <Button
                variant="maps"
                className="bg-[#43B3F8] border-none hover:bg-[#43B3F8]/80"
              >
                <a
                  href={project?.wase_link_map}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center"
                >
                  <WazeLogo size={18} className="mr-2" />
                  {t("continueInWaze")}
                </a>
              </Button>
            )}
          </div>
        )}
      </section>
      {SHOULD_LOAD_GOOGLE_MAPS && lat && lng && (
        <div
          ref={mapContainerRef}
          className="w-full h-[30rem] bg-neutral-50 relative"
          style={{ minHeight: "30rem" }}
        >
          {isMapVisible ? (
            <MapErrorBoundary>
              <LazyMapWithProvider lat={lat} lng={lng} />
            </MapErrorBoundary>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400"></div>
          )}
        </div>
      )}
    </>
  );
}
