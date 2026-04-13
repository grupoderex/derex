"use client";

import { JaverMarker } from "@/components/icons/JaverMarker";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";

interface HousingMapWrapperProps {
  lat: number;
  lng: number;
}

export default function HousingMapWrapper({
  lat,
  lng,
}: HousingMapWrapperProps) {
  return (
    <Map
      defaultCenter={{ lat, lng }}
      zoom={15}
      mapId="housing_development_map"
      className="w-full h-full"
      disableDefaultUI={false}
      gestureHandling="cooperative"
    >
      <AdvancedMarker position={{ lat, lng }}>
        <JaverMarker size={64} />
      </AdvancedMarker>
    </Map>
  );
}
