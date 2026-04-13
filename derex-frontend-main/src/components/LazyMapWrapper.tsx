"use client";

import { JaverMarker } from "@/components/icons/JaverMarker";
import { MapProjectInfo } from "@/components/MapProjectInfo";
import { GOOGLE_MAPS_KEY } from "@/constants";
import { ProjectByFilters } from "@/models/project_by_filters_result";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";

interface LazyMapWrapperProps {
  initialCenter: { lat: number; lng: number };
  markersData: Array<{
    project: ProjectByFilters;
    lat: number;
    lng: number;
  }>;
  hoveredProject: number | null;
  selectedProject: number | null;
  onMarkerClick: (projectId: number) => void;
  onClosePopover: () => void;
  showPinPopover: number | null;
}

function MapEffectHandler({
  markersData,
  showPinPopover,
}: {
  markersData: LazyMapWrapperProps["markersData"];
  showPinPopover: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (!window.google?.maps) return;

    const bounds = new window.google.maps.LatLngBounds();
    markersData.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));

    if (showPinPopover) {
      const target = markersData.find(
        ({ project }) => project.project_id === showPinPopover
      );
      if (target) {
        map.panTo({ lat: target.lat, lng: target.lng });
        map.setZoom(13);
      }
    } else if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  }, [map, markersData, showPinPopover]);

  return null;
}

export default function LazyMapWrapper({
  initialCenter,
  markersData,
  hoveredProject,
  selectedProject,
  onMarkerClick,
  onClosePopover,
  showPinPopover,
}: LazyMapWrapperProps) {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_KEY ?? ""}>
      <Map
        mapId="states_map"
        defaultCenter={initialCenter}
        defaultZoom={12}
        className="w-full h-full"
        disableDefaultUI={true}
      >
        {/* Componente interno que maneja el zoom/paneo automático */}
        <MapEffectHandler
          markersData={markersData}
          showPinPopover={showPinPopover}
        />

        {markersData.map(({ project, lat, lng }, index) => (
          <AdvancedMarker
            key={index}
            position={{ lat, lng }}
            onClick={() => onMarkerClick(project.project_id)}
            className="flex flex-col items-center"
            title={project.project_name || "Proyecto Javer"}
          >
            {showPinPopover === project.project_id && (
              <MapProjectInfo project={project} onClose={onClosePopover} />
            )}
            <JaverMarker
              color={
                hoveredProject === project.project_id ||
                selectedProject === project.project_id ||
                showPinPopover === project.project_id
                  ? undefined
                  : "black"
              }
              size={64}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
