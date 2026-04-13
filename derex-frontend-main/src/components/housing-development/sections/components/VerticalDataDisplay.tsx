"use client";
import { useTranslation } from "react-i18next";

interface VerticalDataDisplayProps {
  departments?: number;
  levels?: number;
}

export function VerticalDataDisplay({
  departments = 0,
  levels = 0,
}: VerticalDataDisplayProps) {
  const { t } = useTranslation("translations");

  return (
    <div className="flex flex-row gap-4 items-stretch">
      <div className="flex flex-col justify-between max-md:w-1/2">
        <div className="font-bold text-foreground-soft">
          {t("departamentsPerTower")}
        </div>
        <h6 className="text-primary text-[18px] lg:text-[24px]">
          {departments}
        </h6>
      </div>
      <div className="flex flex-col justify-between max-md:w-1/2">
        <div className="font-bold text-foreground-soft">{t("levels")}</div>
        <h6 className="text-primary text-[18px] lg:text-[24px]">{levels}</h6>
      </div>
    </div>
  );
}
