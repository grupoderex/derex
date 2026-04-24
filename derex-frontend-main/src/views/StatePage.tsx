"use client";

import { JaverMarker } from "@/components/icons/JaverMarker";
import { MapProjectInfo } from "@/components/MapProjectInfo";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@/i18n";
import { LocationHierarchy } from "@/models/location_hierarchy";
import { ProjectByFiltersResult } from "@/models/project_by_filters_result";
import { sortPrices } from "@/models/sort_order";
import { toUrlCase } from "@/utils/common.utils";
import { Icon } from "@iconify/react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { MapCameraControl } from "@/components/MapCameraControl";
import { MapErrorBoundary } from "@/components/MapErrorBoundary";
import { GOOGLE_MAPS_KEY, SHOULD_LOAD_GOOGLE_MAPS } from "@/constants";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@vis.gl/react-google-maps").then((mod) => mod.Map),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
        Cargando mapa...
      </div>
    ),
  }
);

const AdvancedMarker = dynamic(
  () => import("@vis.gl/react-google-maps").then((mod) => mod.AdvancedMarker),
  { ssr: false, loading: () => null }
);

interface StatePageProps {
  filteredZones: ProjectByFiltersResult[];
  state: LocationHierarchy;
  selectedZone: string;
  priceIndex: number;
}

export default function StatePage({
  state,
  selectedZone,
  priceIndex,
  filteredZones,
}: StatePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMapVisible, setIsMapVisible] = useState(false);

  const [hasMapInitialized, setHasMapInitialized] = useState(false);

  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showPinPopover, setShowPinPopover] = useState<number | null>(null);
  const { t } = useTranslation("translations");

  const filteredZonesLatLngs = useMemo(
    () =>
      filteredZones?.flatMap((zone) =>
        zone.projects
          .map((project) => ({
            project,
            lat: Number(project.latitud.trim()),
            lng: Number(project.longitud.trim()),
          }))
          .filter(({ lat, lng }) => !isNaN(lat) && !isNaN(lng))
          .filter(
            ({ project }) =>
              selectedProject === null || project.project_id === selectedProject
          )
      ),
    [filteredZones, selectedProject]
  );


  const handleChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams?.toString());
    if (value === "-1") {
      newParams.delete("price");
    } else {
      newParams.set("price", value);
    }
    router.push(`?price=${value}`, { scroll: false });
  };

  const handleZoneChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams?.toString());

    if (value === "all") {
      newParams.delete("zona");
      router.push(`?${newParams.toString()}`, { scroll: false });
    } else {
      newParams.set("zona", value);
    }

    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const initialCenter = useMemo(() => {
    if (filteredZonesLatLngs && filteredZonesLatLngs.length > 0) {
      return {
        lat: filteredZonesLatLngs[0].lat,
        lng: filteredZonesLatLngs[0].lng,
      };
    }
    return { lat: 25.6866, lng: -100.3161 }; // Fallback (Monterrey)
  }, [filteredZonesLatLngs]);

  const toggleMap = () => {
    if (!hasMapInitialized) {
      setHasMapInitialized(true);
    }
    setIsMapVisible(!isMapVisible);
    setSelectedProject(null);
    setShowPinPopover(null);
  };

  return (
    <div className="mb-8">
      {SHOULD_LOAD_GOOGLE_MAPS && (
        <div className="fixed md:hidden bottom-4 z-10 w-full px-4">
          <Button className="w-full" onClick={toggleMap}>
            {isMapVisible ? (
              <>
                <Icon icon="heroicons:list-bullet" width="24" className="mr-2" />
                {t("seeList")}
              </>
            ) : (
              <>
                <Icon icon="heroicons:map-pin" width="24" className="mr-2" />
                {t("seeMap")}
              </>
            )}
          </Button>
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <div
          className="flex flex-col lg:flex-row justify-between lg:items-end my-8 gap-8"
        >
          <h2 className="font-bold  text-4xl lg:text-[56px] lg:leading-14">
            {state?.name}
          </h2>
          <div className="flex flex-row gap-4 items-end">
            <div className="md:w-64 w-full hidden">
              <Label className="normal-case">{t("orderPrice")}</Label>
              <Select
                value={priceIndex.toString() ?? "-1"}
                onValueChange={handleChange}
              >
                <SelectTrigger aria-label={t("orderPrice")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="-1" value="-1">
                    {t("allPrices")}
                  </SelectItem>
                  {sortPrices.map((zone, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(zone.min)}{" "}
                      -{" "}
                      {zone.max
                        ? new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(zone.max)
                        : "Más"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-64 w-full">
              <Label className="normal-case">{t("viewBy")}</Label>
              <Select
                value={selectedZone ?? "all"}
                onValueChange={handleZoneChange}
              >
                <SelectTrigger aria-label={t("viewBy")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="empty" value={"all"}>
                    {t("allZones")}
                  </SelectItem>
                  {state?.ciudades?.map((zone) => (
                    <SelectItem key={zone.id} value={toUrlCase(zone.name)}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {SHOULD_LOAD_GOOGLE_MAPS && (
              <Button className="max-md:hidden" onClick={toggleMap}>
                {isMapVisible ? (
                  <>
                    <Icon
                      icon="heroicons:list-bullet"
                      width="24"
                      className="mr-2"
                    />
                    {t("seeList")}
                  </>
                ) : (
                  <>
                    <Icon icon="heroicons:map-pin" width="24" className="mr-2" />
                    {t("seeMap")}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        <div className={`flex flex-col-reverse lg:flex-row ${isMapVisible ? "gap-8" : ""}`}>
          {/* LISTA DE PROYECTOS: Solo visible si NO estamos viendo el mapa en mobile */}
          <div
            className={`flex min-w-0 flex-col gap-16 pt-4 grow transition-all ${isMapVisible ? "max-lg:hidden" : ""
              }`}
          >
            {filteredZones?.length === 0 ? (
              <h5 className="text-gray-500">{t("noDevelopmentsFound")}</h5>
            ) : null}
            {filteredZones?.map((zone) => (
              <div key={zone.city_id}>
                <h3 className="font-bold">{zone.city_name}</h3>
                <hr className="border-primary my-4 border" />
                <div className="flex flex-col gap-8 ">
                  {zone.projects.map((project, index) => (
                    <ProjectCard
                      key={project.project_id}
                      project={project}
                      priority={index < 2}
                      isGalleryEnabled={!isMapVisible}
                      isSelected={selectedProject === project.project_id}
                      onMouseEnter={() => {
                        setHoveredProject(project.project_id);
                      }}
                      onMouseLeave={() => {
                        setHoveredProject(null);
                      }}
                      onClick={() => {
                        if (!isMapVisible) return;

                        if (selectedProject === project.project_id) {
                          setSelectedProject(null);
                          setShowPinPopover(null);
                        } else {
                          setSelectedProject(project.project_id);
                          setShowPinPopover(project.project_id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* CONTENEDOR DEL MAPA */}
          {SHOULD_LOAD_GOOGLE_MAPS && (
            <div
              className={`relative lg:mt-[120px] w-full shrink-0 transition-all ${isMapVisible
                ? "lg:w-[460px] xl:w-[500px] h-[90vh]"
                : "!w-0 h-0 overflow-hidden"
                }`}
            >
              {hasMapInitialized || isMapVisible ? (
                <MapErrorBoundary>
                  <APIProvider apiKey={GOOGLE_MAPS_KEY ?? ""}>
                    <Map
                      mapId="states_map"
                      defaultCenter={initialCenter}
                      defaultZoom={12}
                      className="w-full h-full"
                      disableDefaultUI={true}
                    >
                      <MapCameraControl
                        boundsData={filteredZonesLatLngs}
                        highlightedProjectId={showPinPopover}
                        isMapVisible={isMapVisible}
                      />

                      {filteredZonesLatLngs?.map(({ project, lat, lng }, index) => (
                        <AdvancedMarker
                          key={index}
                          position={{
                            lat,
                            lng,
                          }}
                          onClick={() => {
                            if (showPinPopover !== project.project_id) {
                              setShowPinPopover(project.project_id);
                            }
                          }}
                          className="flex flex-col items-center"
                          title={project.project_name || "Proyecto Javer"}
                          aria-label={`Ver mapa de ${project.project_name}`}
                        >
                          {showPinPopover === project.project_id && (
                            <MapProjectInfo
                              project={project}
                              onClose={() => {
                                setTimeout(() => {
                                  setShowPinPopover(null);
                                }, 100);
                              }}
                            />
                          )}
                          <JaverMarker
                            color={
                              hoveredProject === project.project_id ||
                                selectedProject === project.project_id ||
                                showPinPopover === project.project_id
                                ? undefined
                                : "black"
                            }
                            size={32}
                          />
                        </AdvancedMarker>
                      ))}
                    </Map>
                  </APIProvider>
                </MapErrorBoundary>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
