"use client";

"@/i18n";
import { Img } from "@/views/Img";
import { ImageWithText } from "@/components/shared/ImageText";
import { Title } from "@/components/shared/Title";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { WebsiteMedia } from "@/models/website_media";
import { CertificationsAndAwardsResponse } from "@/models/certifications";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

interface CertificationPageProps {
  websiteMedia: WebsiteMedia;
  certificationTitles: any;
  certifications: CertificationsAndAwardsResponse;
}

export default function Page({
  websiteMedia,
  certificationTitles,
  certifications,
}: CertificationPageProps) {
  const { i18n, t } = useTranslation("translations");

  return (
    <section className="md:m-10 xl:mx-20">
      <Title
        className={`!font-extrabold  ${certificationTitles?.certifications_mainTitle?.className}`}
      >
        {i18n.language === "en"
          ? certificationTitles?.certifications_mainTitle?.value_en
          : certificationTitles?.certifications_mainTitle?.value}
      </Title>
      {websiteMedia.value ? (
        <ImageWithText
          src={
            certificationTitles?.certifications_bannerUrl?.value ??
            websiteMedia.value
          }
          alt={certificationTitles?.certifications_bannerUrl?.value_en}
          className={`font-roboto ${certificationTitles?.certifications_bannerTitle?.className}`}
        >
          {i18n.language === "en"
            ? certificationTitles?.certifications_bannerTitle?.value_en
            : certificationTitles?.certifications_bannerTitle?.value}
        </ImageWithText>
      ) : null}

      {certifications?.data.map((cert: any) => (
        <div key={cert.id} className="flex items-center p-5 flex-wrap">
          <div className="md:w-1/3 w-full bg-primary flex justify-center md:justify-normal rounded-md ">
            <Img
              className=" w-full  rounded-md "
              src={cert.image_url}
              alt={cert.image_alt_text}
            />
          </div>
          <div className="md:w-2/3 w-full text-justify p-5 ">
            <h6 className="font-bold text-center md:text-left text-lg md:text-2xl">
              {i18n.language === "en" ? cert.title_en : cert.title_es}
            </h6>
            <div className="flex justify-between">
              <p className="inline-block font-roboto text-base">
                {i18n.language === "en"
                  ? cert.description_en
                  : cert.description_es}
                &nbsp;
                {((i18n.language === "es" && cert.button_url) ||
                  (i18n.language === "en" && cert.button_url_en)) && (
                  <a
                    href={cert.button_url}
                    target={cert.new_tab ? "_blank" : "_self"}
                    rel="noreferrer"
                    className=" inline-block underline text-primary"
                  >
                    [{t("continueReading")}]
                  </a>
                )}
              </p>
            </div>
            {cert.show_date && (
              <p className="my-10 text-slate-400">
                {dayjs(cert.date)
                  .tz("America/Mexico_City")
                  .locale(i18n.language === "en" ? "en" : "es")
                  .format("LL")}
              </p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
