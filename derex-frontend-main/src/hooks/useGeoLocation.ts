import { useState, useCallback } from "react";
import { LatLng } from "@/types/lat_lon";

function haversineDistanceBetweenPoints(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  return (
    Math.acos(
      Math.sin(p1) * Math.sin(p2) +
        Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda)
    ) * R
  );
}

export function useGeolocation() {
  const [coords, setCoords] = useState<LatLng | null>(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("lonLat");
      return s ? JSON.parse(s) : null;
    }
    return null;
  });

  const [permissionStatus, setPermissionStatus] = useState<
    PermissionState | "unknown"
  >("unknown");

  const fetchPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const data = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(data);
        localStorage.setItem("lonLat", JSON.stringify(data));
      },
      (err) => console.warn(err)
    );
  };

  const requestPosition = useCallback(async (isUserAction = false) => {
    if (!navigator.geolocation || !navigator.permissions) return;

    try {
      const status = await navigator.permissions.query({ name: "geolocation" });
      setPermissionStatus(status.state);
      if (status.state === "granted" || isUserAction) {
        fetchPosition();
      }
    } catch (error) {
      if (isUserAction) fetchPosition();
    }
  }, []);

  const getDistance = useCallback(
    (targetLat: number, targetLon: number) => {
      if (!coords) return null;
      const lat1 = coords.lat;
      const lon1 = coords.lon;
      return haversineDistanceBetweenPoints(lat1, lon1, targetLat, targetLon);
    },
    [coords]
  );

  return { coords, requestPosition, permissionStatus, getDistance };
}
