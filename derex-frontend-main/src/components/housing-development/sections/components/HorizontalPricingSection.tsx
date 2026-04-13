"use client";
import { LowestPriceProperty } from "@/components/LowestPriceProperty";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Project } from "@/models/project";
import { type Property } from "@/models/property";
import { type PropertySearch } from "@/models/property_search";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";
import { CreditTypesBadges } from "./CreditTypesBadges";

interface HorizontalPricingSectionProps {
  development?: Project;
  properties?: Property | PropertySearch[];
  lowestPrice?: number;
}

export function HorizontalPricingSection({
  development,
  properties,
  lowestPrice,
}: HorizontalPricingSectionProps) {
  const { t } = useTranslation("translations");

  return (
    <>
      <div className="mb-8">
        {lowestPrice && lowestPrice > 0 ? (
          <>
            <h6 className="text-foreground-soft font-bold mt-3 text-2xl">
              {t("fromPrice")}
            </h6>
            <div className="flex flex-col lg:flex-row gap-4 md:items-center">
              <h3
                className="text-primary text-3xl lg:text-5xl"
                style={{ fontSize: "3rem" }}
              >
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(lowestPrice)}
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">{t("viewAllPrices")}</Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto md:max-w-4xl md:max-h-none">
                  <DialogTitle className="sr-only">{t("viewAllPrices")}</DialogTitle>
                  <LowestPriceProperty
                    properties={properties}
                    project={development}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          <h4 className="text-primary text-3xl lg:text-5xl font-display">
            {t("contactConsultant")}
          </h4>
        )}
      </div>
      {/* Credit Types */}
      {development && development.credit_types.length > 0 && (
        <CreditTypesBadges
          creditTypes={development.credit_types}
          variant={"inline"}
        />
      )}
      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        <Button asChild>
          <Link
            to="models-section"
            smooth
            className="flex items-center cursor-pointer"
          >
            {t("knowTheModels")}
            <Icon
              icon="heroicons-solid:arrow-down"
              width="24"
              className="ml-2"
            />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link
            to="contact-section"
            smooth
            className="flex items-center cursor-pointer"
          >
            {t("contactUs")}
            <Icon icon="heroicons-solid:mail" width="24" className="ml-2" />
          </Link>
        </Button>
      </div>
    </>
  );
}
