"use client";
import "@/i18n";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function Page() {
  const { t } = useTranslation("translations");

  return (
    <div className="container mx-auto h-[60vh] flex flex-col items-center justify-center">
      <h2 className="text-3xl lg:text-5xl font-bold text-center text-primary">
        {t("thanksTitle")}
      </h2>
      <h6 className="text-center mt-4 text-lg">{t("thanksMessage")}</h6>
      <div className="flex justify-center mt-8">
        <Button asChild>
          <Link href="/" className="btn btn-primary">
            {t("returnToHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
