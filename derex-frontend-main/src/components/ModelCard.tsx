import { type PropertySearch } from "@/models/property_search";
import { getUrgencyByPropertyId } from "@/utils/api";
import { toUrlCase } from "@/utils/common.utils";
import { Icon } from "@iconify/react";
import Image from "next/image"; // 1. Importar Image
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PropertyAmenity,
  PropertyAmenityType,
} from "../components/PropertyAmenity";
import { Chip } from "../components/shared/Chip";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ModelCardProps = React.HTMLAttributes<HTMLDivElement> & {
  model: PropertySearch;
  projectName: string;
  orientation?: "horizontal" | "vertical" | "mixed";
  showHidden?: boolean;
  priority?: boolean; // 2. Nueva prop para LCP
};

export const ModelCard = ({
  model,
  projectName,
  className,
  orientation = "vertical",
  showHidden = false,
  priority = false, // Default false
  ...props
}: ModelCardProps) => {
  const [urgencyChip, setUrgencyChip] = useState<any>(null);

  const { t, i18n } = useTranslation("translations");

  const lowestPrice = useMemo(
    () =>
      model.precios.reduce(
        (acc, price) => (price.price_base < acc ? price.price_base : acc),
        model.precios[0]?.price_base
      ),
    [model]
  );

  useEffect(() => {
    async function getUrgecyChip() {
      const chipData = await getUrgencyByPropertyId(model.id);
      setUrgencyChip(chipData);
    }
    getUrgecyChip();
  }, [model]);

  // Lógica de estilos extraída para legibilidad
  const isVerticalOrMixedFloor =
    orientation === "vertical" ||
    (orientation === "mixed" && model.vertical_floor);

  return (
    <Link
      href={`/desarrollos/${projectName}/propiedad/${toUrlCase(model.name)}${
        showHidden ? `?show_invisible=${showHidden}` : ""
      }`}
      className="flex gap-2 items-center mx-auto w-full md:w-auto"
    >
      <Card
        {...props}
        className={`border-none flex ${
          isVerticalOrMixedFloor
            ? "flex-col w-[328px] md:flex-row md:w-[560px] md:max-w-[560px] rounded-[16px] lg:min-w-[668px] lg:max-w-none"
            : "flex-col lg:flex-row lg:items-stretch"
        } ${className}`}
      >
        <CardHeader
          className={`relative ${
            isVerticalOrMixedFloor ? "" : ""
          } w-[328px] md:w-[280px] lg:w-[328px] h-[240px] p-0 shrink-0`} // Ajustamos ancho en md para dejar espacio al contenido
        >
          {urgencyChip?.is_active && (
            <Chip
              name={
                i18n.language === "es"
                  ? urgencyChip.description_es
                  : urgencyChip.description_en
              }
              className={
                "bg-error-medium absolute top-6 left-3 lg:top-2 lg:left-2 z-10 text-white"
              }
            />
          )}

          {/* 3. Reemplazo por Next/Image */}
          {model.thumbnail ? (
            <Image
              src={model.thumbnail}
              alt={model.thumbnail_alt_text || model.name}
              width={328}
              height={240}
              priority={priority}
              unoptimized={process.env.NODE_ENV !== "production"}
              sizes="(max-width: 768px) 100vw, 328px"
              className={`object-cover w-full h-full ${
                isVerticalOrMixedFloor
                  ? "rounded-t-2xl lg:rounded-tr-none lg:rounded-l-2xl" // Ajuste de bordes para coincidir con diseño
                  : "rounded-t-2xl lg:rounded-l-2xl lg:rounded-r-none"
              }`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}

          {model.vertical_floor && (
            <div className="absolute top-6 right-8 text-primary font-bold bg-neutral-100 px-2 py-2 rounded text-sm">
              {t("level")} {model.vertical_floor}
            </div>
          )}
        </CardHeader>

        <CardContent
          className={`grow min-w-0 ${
            isVerticalOrMixedFloor
              ? "flex flex-col gap-4 p-4 md:min-w-[250px] md:shrink-0 lg:min-w-0"
              : "mt-4 lg:flex lg:flex-col lg:justify-between lg:w-96"
          }`}
        >
          <CardTitle className="font-bold text-lg">{model.name}</CardTitle>
          {lowestPrice ? (
            <p className="mt-2 font-bold">
              {t("fromPrice")}:{" "}
              <span className=" text-primary font-bold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(lowestPrice)}
              </span>
            </p>
          ) : (
            <p className="mt-2 ">{t("noPrices")}</p>
          )}
          <div className="flex flex-row gap-1 mt-2 [&>*]:w-1/3">
            <PropertyAmenity
              type={PropertyAmenityType.Rooms}
              quantity={model.rooms}
            />
            <PropertyAmenity
              type={PropertyAmenityType.Bathrooms}
              quantity={model.bathrooms + (model.restrooms ?? 0) / 2}
            />
            <PropertyAmenity
              type={
                model.cars_garage_capacity > model.cars_parking_lot_capacity
                  ? PropertyAmenityType.Garage
                  : PropertyAmenityType.Parking
              }
              quantity={Math.max(
                model.cars_garage_capacity,
                model.cars_parking_lot_capacity
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button variant="ghost">
              {t("knowMore")}
              <Icon icon="heroicons:arrow-right" width="18" className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
