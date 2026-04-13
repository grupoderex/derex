"use client";

import "@/i18n";
import { ImageWithText } from "@/components/shared/ImageText";
import { Title } from "@/components/shared/Title";
import { Mark } from "@/components/shared/Mark";
import { useTranslation } from "react-i18next";
import { WebsiteMediaObject } from "@/models/website_media";
import { DecalogueSection } from "@/models/decalogues";

interface DecaloguePageProps {
  websiteMedia: WebsiteMediaObject;
  homeTitles: any;
  decalogueData: DecalogueSection[];
}

export default function DecaloguePage({
  websiteMedia,
  homeTitles,
  decalogueData,
}: DecaloguePageProps) {
  const { i18n, t } = useTranslation("translations");

  return (
    <div className="my-10 mx-2 sm:mx-10  xl:mx-40 md:min-h-[70vh] ">
      <Title
        className={`!font-extrabold ${homeTitles?.others_decalogues?.className}`}
      >
        {i18n.language === "en"
          ? homeTitles?.others_decalogues?.value_en
          : homeTitles?.others_decalogues?.value}
      </Title>
      <div className="mt-8">
        {websiteMedia.decalogos_image ? (
          <ImageWithText
            src={websiteMedia.decalogos_image}
            className="font-roboto"
          >
            <Mark>Javer</Mark> está comprometido con los valores de integridad,
            pasión, identidad, sostenibilidad, innovación y respeto.
          </ImageWithText>
        ) : null}
        {decalogueData?.map((v: any) => (
          <div key={v.id} className="p-5">
            <div className="text-primary font-bold my-5 font-roboto">
              {i18n.language === "en" ? v.name_en : v.name_es}
            </div>
            {v.decalogue.map((i: any) => (
              <div key={i.id}>
                <p className="font-roboto">
                  {i18n.language === "en" ? i.title_en : i.title_es} [{" "}
                  <a
                    target="_blank"
                    className="underline text-primary"
                    href={i.file ?? "#!"}
                    rel="noreferrer"
                  >
                    {t("decalogueReadMore")}
                  </a>{" "}
                  ]
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
