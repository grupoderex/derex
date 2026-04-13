"use client";
import "@/i18n";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "@iconify/react";

export default function EthicCodePage({ homeTitles }: { homeTitles: any }) {
  const { t, i18n } = useTranslation("translations");
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <div className="container py-16 flex flex-col gap-8">
      <h3
        className={`text-3xl lg:text-5xl ${homeTitles?.others_ethicsCode?.className}`}
      >
        {i18n.language === "en"
          ? homeTitles?.others_ethicsCode?.value_en
          : homeTitles?.others_ethicsCode?.value}
      </h3>
      <p className="font-roboto">{t("codeOfEthicsPageDescription")}</p>

      <Button className="self-center">
        <a
          href="/archivos/CodigoDeEticaJAVER2020_83cd.pdf"
          target="_blank"
          rel="noreferrer"
          className="flex gap-2"
        >
          <Icon icon="heroicons-outline:download" width="20" />
          {t("downloadCodeOfEthics")}
        </a>
      </Button>

      <Alert variant="destructive">
        <Icon
          icon="heroicons:exclamation-triangle"
          width="24"
          className="text-primary"
        />
        <AlertTitle className="text-2xl !font-normal ">
          {t("important")}
        </AlertTitle>
        <AlertDescription className="font-roboto">
          {t("codeOfEthicsNote")}
        </AlertDescription>
      </Alert>

      <div className="flex gap-2 self-center">
        <Checkbox
          checked={isAccepted}
          onCheckedChange={(value) => {
            setIsAccepted(Boolean(value));
          }}
        />
        <span className="text-sm font-roboto">
          {t("codeOfEthicsCheckboxMessage")}
        </span>
      </div>

      <Button className="self-center" disabled={!isAccepted}>
        <a href="mailto:jperez@javer.com.mx?subject=Adjuntar%20documento%20con%20la%20Firma%20del%20C%C3%B3digo%20de%20%C3%A9tica%20Javer">
          {t("sendCodeOfEthics")}
        </a>
      </Button>
    </div>
  );
}
