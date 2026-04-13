import { type Project } from "@/models/project";
import { type Property } from "@/models/property";
import { type PropertySearch } from "@/models/property_search";
import { getResourceUrl } from "@/utils/image.utils";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Image from "next/image";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
dayjs.extend(LocalizedFormat);

interface LowestPricePropertyProps {
  project?: Project;
  properties?: Property | PropertySearch[];
}

export function LowestPriceProperty({
  properties,
  project,
}: LowestPricePropertyProps) {
  const { t, i18n } = useTranslation("translations");

  const prices = useMemo(() => {
    if (Array.isArray(properties)) {
      return properties.flatMap((property) => property.precios);
    }

    return properties?.precios ?? [];
  }, [properties]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-primary font-semibold text-center uppercase">
        {t("priceMoreInfoTitle")}
      </p>
      <div className="flex flex-col lg:flex-row gap-4">
        <Image
          className="object-contain"
          width={128}
          height={128}
          src={getResourceUrl(project?.logo_color)!}
          alt={project?.name ?? "Project Logo"}
        />
        <div className="grow">
          <div className="flex flex-col h-full">
            <div className="grow grid grid-cols-3 items-center">
              <div></div>
              <div className="text-neutral-400 text-center">
                {t("priceFrom")}*
              </div>
              <div className="text-neutral-400 text-center">
                {t("priceM2Extra")}*
              </div>
            </div>
            <hr />
            <div className="grow grid grid-cols-3 items-center gap-y-4 mt-4">
              {prices?.flatMap((price) => [
                <div
                  className="text-center text-lg font-bold text-primary"
                  key={price.id + "_title"}
                >
                  {price?.name}
                </div>,
                <div
                  className="text-center text-lg font-bold"
                  key={price.id + "_price"}
                >
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(price?.price_base ?? 0)}
                </div>,
                <div
                  className="text-center text-lg font-bold"
                  key={price.id + "_ext"}
                >
                {!price?.price_m2_ext
                  ? "N/A"
                  : new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(price.price_m2_ext)}
                </div>,
              ])}
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-justify ">
        {t("priceMoreInfoDisclaimer", {
          lastDate: dayjs().endOf("month").locale(i18n.language).format("LL"),
        })}
      </p>
    </div>
  );
}
