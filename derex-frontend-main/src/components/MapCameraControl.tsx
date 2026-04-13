import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export function MapCameraControl({
    boundsData,
    highlightedProjectId,
    isMapVisible
  }: {
    boundsData: { lat: number; lng: number; project: any }[];
    highlightedProjectId: number | null;
    isMapVisible: boolean;
  }) {
    const map = useMap();
  
    useEffect(() => {
      if (!map || !isMapVisible) return;
      if (!window.google?.maps) return;

      const timer = setTimeout(() => {
        if (highlightedProjectId) {
          const target = boundsData.find(
            (item) => item.project.project_id === highlightedProjectId
          );
          if (target) {
            map.setCenter({ lat: target.lat, lng: target.lng });
            map.setZoom(13);
          }
        }
        else {
          const bounds = new window.google.maps.LatLngBounds();
          let hasPoints = false;

          boundsData.forEach(({ lat, lng }) => {
            bounds.extend({ lat, lng });
            hasPoints = true;
          });

          if (hasPoints && !bounds.isEmpty()) {
            map.fitBounds(bounds);
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }, [map, boundsData, highlightedProjectId, isMapVisible]);
  
    return null; 
  }