"use client";
import { LowestPriceProperty } from "@/components/LowestPriceProperty";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Project } from "@/models/project";
import { type Property } from "@/models/property";
import { type PropertySearch } from "@/models/property_search";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";
import { CreditTypesBadges } from "./CreditTypesBadges";
import { PropertySelector } from "./PropertySelector";
import { VerticalDataDisplay } from "./VerticalDataDisplay";

interface VerticalPricingCardProps {
  development?: Project;
  properties?: Property | PropertySearch[];
  lowestPrice?: number;
  showHidden?: boolean;
}

export function VerticalPricingCard({
  development,
  properties,
  lowestPrice,
  showHidden = false,
}: VerticalPricingCardProps) {
  const { t } = useTranslation("translations");

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end mb-10">
        <Card className="md:w-fit shadow-lg rounded-md max-md:w-full">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col justify-between">
                {lowestPrice && lowestPrice > 0 ? (
                  <>
                    <div className="font-bold text-foreground-soft">
                      {t("fromPrice")}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <h3 className="text-primary text-3xl lg:text-5xl">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(lowestPrice)}
                      </h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Icon
                            icon="heroicons:chevron-right"
                            width="24"
                            className="cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
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
                  <h4 className="text-primary">{t("contactConsultant")}</h4>
                )}
              </div>
              <div className="md:w-px max-md:h-px bg-primary" />
              <PropertySelector
                properties={properties}
                developmentShortName={development?.short_name}
                showHidden={showHidden}
              />
              <div className="md:w-px max-md:h-px bg-primary" />
              <VerticalDataDisplay
                departments={development?.vertical_data?.departments}
                levels={development?.vertical_data?.levels}
              />
            </div>
          </CardContent>
        </Card>
        <Button variant="outline" asChild className="max-md:w-full">
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
      {/* Credit Types */}
      <div className="my-8">
        {development && development.credit_types.length > 0 && (
          <CreditTypesBadges
            creditTypes={development.credit_types}
            variant={"pills"}
          />
        )}
      </div>
    </>
  );
}
