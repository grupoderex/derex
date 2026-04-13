"use client";

import { HouseMaintenance } from "@/components/icons/HouseMaintenimiento";
import { ComplaintsForm } from "@/components/CustomerService/ComplaintsForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function Page() {
  const { t } = useTranslation("translations");

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-center items-center container py-8 md:py-48 gap-8">
        <div className="flex flex-wrap justify-center md:w-1/2">
          <HouseMaintenance size={425} className="max-md:w-full" />
        </div>
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <h3>{t("inMaintenance")}</h3>
          <h4 className="text-foreground-soft">{t("inMaintenanceMessage")}</h4>
          <Button
            className="self-start bg-green-500 shadow-lg gap-2 text-semibold rounded-full hover:bg-green-500 text-white"
            variant="default"
            asChild
          >
            <a
              className="flex flex-row gap-2"
              href="https://wa.me/+5218111336611"
              target="_blank"
              rel="noreferrer"
            >
              <Icon icon="fa-brands:whatsapp" width="20" />
              {t("contactUsInCustomerService")}
            </a>
          </Button>
        </div>
      </div>
      <div className="bg-neutral-100 py-8">
        <div className="container flex flex-col gap-4 max-w-4xl">
          <h4>{t("tipsForMaintenance")}</h4>
          <p>{t("tipsForMaintenanceDescription")} </p>
          <Button className="self-start w-64" asChild>
            <a
              className="flex flex-row gap-2"
              href="/archivos/TipsVivienda.pdf"
              download="guia-mantenimiento.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <Icon icon="heroicons-solid:download" width="20" />
              {t("downloadTipsForMaintenance")}
            </a>
          </Button>
        </div>
      </div>
      <ComplaintsForm />
    </div>
  );
}
