"use client";

import { HomeForm } from "@/components/HomeForm";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { getTitlesBySection } from "@/utils/api";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export function LazyContactSection() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { t, i18n } = useTranslation("translations");

  const { data: homeContact } = useQuery({
    queryKey: ["getHomeContact"],
    queryFn: async () => await getTitlesBySection("home-contact"),
    enabled: isIntersecting,
  });

  return (
    <section
      ref={ref}
      className="container py-12 flex flex-col lg:flex-row gap-8"
    >
      {isIntersecting ? (
        <>
          <div className="lg:w-1/2">
            <h4
              className={`!font-bold mb-2 text-4xl ${homeContact?.home_contact_title?.className} `}
            >
              {i18n.language === "en"
                ? homeContact?.home_contact_title?.value_en
                : homeContact?.home_contact_title?.value}
            </h4>
            <p className="font-roboto">
              {i18n.language === "en"
                ? homeContact?.home_contact_description?.value_en
                : homeContact?.home_contact_description?.value}
            </p>
            <hr className="my-6 border-primary" />
            <div className="flex flex-col justify-around mb-8 gap-8">
              <div className="flex flex-row gap-4 items-center font-roboto">
                <Icon
                  icon="heroicons:phone"
                  className="text-primary"
                  width="28"
                />
                <div>
                  <p>{t("contact")}</p>
                  <strong className="whitespace-pre-wrap">
                    {homeContact?.home_contact_phone?.value
                      ?.split(",")
                      ?.map((phone) => phone.trim())
                      .join("\n")}
                  </strong>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <Icon
                  icon="heroicons:clock"
                  className="text-primary"
                  width="28"
                />
                <div>
                  <p>{t("attentionHours")}</p>
                  <strong className="whitespace-pre-wrap">
                    {(i18n.language === "en"
                      ? homeContact?.home_contact_schedule?.value_en
                      : homeContact?.home_contact_schedule?.value)
                      ?.split(",")
                      ?.map((schedule) => schedule.trim())
                      .join("\n")}
                  </strong>
                </div>
              </div>
            </div>
          </div>
          <HomeForm className="lg:!w-1/2" />
        </>
      ) : (
        <div className="w-full h-96 animate-pulse bg-gray-200 rounded-lg" />
      )}
    </section>
  );
}
