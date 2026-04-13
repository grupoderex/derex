import { ProjectByFiltersResult } from "@/models/project_by_filters_result";
import { sortPrices } from "@/models/sort_order";
import {
    getAllProjectsByFilters,
    getInitialDataDesarrollos,
} from "@/utils/api";
import { toTitleCase, toUrlCase } from "@/utils/common.utils";
import StatePage from "@/views/StatePage";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams?: Promise<{
    zona: string | undefined;
    price: string | undefined;
  }>;
}) {
  const { name } = await params;
  const search = await searchParams;

  const selectedZone = search?.zona ?? "all";
  const queryPice = search?.price ?? "-1";

  const priceIndex = parseInt(queryPice);
  const price = priceIndex >= 0 ? sortPrices[priceIndex] : null;

  const states = await getInitialDataDesarrollos();
  const decodedName = decodeURIComponent(name);
  const normalizedSlug = toUrlCase(decodedName);

  const stateData = states.find(
    (state: any) =>
      toUrlCase(state.name) === normalizedSlug ||
      state.name === toTitleCase(decodedName)
  ) ?? {
    id: 0,
    name: "",
    active: 0,
    created_at: "",
    update_at: "",
    ciudades: [],
  };

  let filteredZones: ProjectByFiltersResult[] = [];
  const hasValidState = Number(stateData?.id) > 0;

  if (hasValidState && selectedZone !== "all") {
    const zonesByState = stateData?.ciudades.find(
      (zone: any) => toUrlCase(zone.name) === selectedZone
    );

    const filters = {
      price_min: price?.min ?? undefined,
      price_max: price?.max ?? undefined,
      state_id: stateData?.id,
      city_id: zonesByState?.id,
    };

    const projectsByZone = await getAllProjectsByFilters(filters);

    filteredZones = [...projectsByZone];
  } else if (hasValidState) {
    const filters = {
      price_min: price?.min ?? undefined,
      price_max: price?.max ?? undefined,
      state_id: stateData?.id,
    };

    const projectsByZone = await getAllProjectsByFilters(filters);

    filteredZones = [...projectsByZone];
  }

  return (
    <>
      {stateData?.banner_url && (
        <div className="relative h-64 w-full">
          <Image
            aria-label="Banner del estado"
            src={stateData.banner_url}
            alt={stateData.name ?? "Banner del estado"}
            fill
            priority={true}
            sizes="(max-width: 768px) 100vw, 100vw"
            style={{ objectFit: "cover" }}
            fetchPriority="high"
            quality={80}
          />
          <div className="absolute top-1 left-0 w-full h-full bg-custom-fade z-10" />
        </div>
      )}

      <StatePage
        state={stateData}
        selectedZone={selectedZone}
        priceIndex={priceIndex}
        filteredZones={filteredZones}
      />
    </>
  );
}
