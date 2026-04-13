"use client";
import { useTranslation } from "react-i18next";

interface CreditTypesBadgesProps {
  creditTypes: string[];
  variant?: "pills" | "inline";
}

export function CreditTypesBadges({
  creditTypes,
  variant = "inline",
}: CreditTypesBadgesProps) {
  const { t } = useTranslation("translations");

  if (variant === "pills") {
    return (
      <div className="flex flex-col items-start gap-2 text-foreground-soft flex-wrap">
        <div className="font-semibold text-foreground-soft">
          {t("creditTypes")}
        </div>
        <div className="flex flex-row items-center gap-2 flex-wrap">
          {creditTypes.map((creditName, index) => (
            <div
              key={index}
              className="font-display text-sm lg:text-base py-1 px-2 bg-neutral-100 rounded-md text-foreground"
            >
              {creditName}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2 text-foreground-soft">
      <span>{t("creditTypes")}</span>
      <div className="flex flex-row items-center gap-2 flex-wrap">
        {creditTypes.map((creditName, index) => (
          <div key={index}>
            <span className="font-display text-sm lg:text-base font-bold">
              {creditName}
            </span>
            {index < creditTypes.length - 1 && (
              <span className="mx-1 font-semibold">|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
