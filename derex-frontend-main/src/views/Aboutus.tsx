"use client";
import "@/i18n";
import { AboutSection } from "@/models/about_javer";
import { MetadataTitle } from "@/models/metadata";
import { Interweave } from "interweave";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AboutUsProps {
  titles: Record<string, MetadataTitle>;
  data: AboutSection[];
}

export function AboutUs({ titles, data }: AboutUsProps) {
  const { i18n } = useTranslation("translations");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage = mounted ? i18n.language : "es";
  const isEnglish = currentLanguage?.toLowerCase().startsWith("en");

  return (
    <div>
      <div className="relative">
        <div className="cover"></div>
        <img
          className="object-cover h-[80vh] w-full"
          src={titles?.aboutJaver_bannerUrl?.value}
          alt={titles?.aboutJaver_bannerUrl?.value_en}
        />
        <h1
          className={`absolute bottom-8 left-8 md:bottom-32 md:left-32 text-white max-w-xl lg:text-7xl text-5xl ${titles?.aboutJaver_mainTitle?.className}`}
        >
          {isEnglish
            ? titles?.aboutJaver_mainTitle?.value_en
            : titles?.aboutJaver_mainTitle?.value}
        </h1>
      </div>
      <div className="flex flex-col mx-auto max-w-[1920px] lg:px-0">
        {data?.map((section: any) => (
          <div
            key={section.index_order}
            className={`flex flex-col items-stretch ${
              section.is_image_left ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <img
              className="md:w-1/2 object-cover"
              src={section.image_url}
              alt={section.image_alt_text}
            />
            <div className="md:w-1/2 h-fit font-roboto p-16">
              {mounted ? (
                <Interweave
                  content={
                    isEnglish
                      ? section.content_en || section.content_es || ""
                      : section.content_es || section.content_en || ""
                  }
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
