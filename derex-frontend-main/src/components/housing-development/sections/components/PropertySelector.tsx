"use client";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { type Property } from "@/models/property";
import { type PropertySearch } from "@/models/property_search";
import { toUrlCase } from "@/utils/common.utils";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface PropertySelectorProps {
  properties?: Property | PropertySearch[];
  developmentShortName?: string;
  showHidden?: boolean;
}

export function PropertySelector({
  properties,
  developmentShortName,
  showHidden = false,
}: PropertySelectorProps) {
  const { t } = useTranslation("translations");
  const navigate = useRouter();

  const handleValueChange = (value: string) => {
    if (value === "ALL") {
      document
        .querySelector("#models-section")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      const model = Array.isArray(properties)
        ? properties.find((p) => p.id === parseInt(value))
        : properties;

      navigate.push(
        `/desarrollos/${toUrlCase(developmentShortName ?? "")}/propiedad/${toUrlCase(model?.name ?? "")}${
          showHidden ? `?show_invisible=${showHidden}` : ""
        }`
      );
    }
  };

  const propertiesList = Array.isArray(properties) ? properties : [properties];

  return (
    <div className="flex flex-col justify-between">
      <div className="font-bold text-foreground-soft">
        {t("avaliableProperties")}
      </div>
      <Select value="" onValueChange={handleValueChange}>
        <SelectTrigger className="bg-transparent border-0 p-0 [&>span]:font-display [&>span]:text-xl">
          <SelectValue placeholder={t("selectProperty")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Ver todos</SelectItem>
          {propertiesList?.map((property) => (
            <SelectItem
              key={property?.id}
              value={property?.id?.toString() ?? " "}
            >
              {property?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
