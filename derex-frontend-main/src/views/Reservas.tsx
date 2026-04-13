"use client";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { Img } from "@/views/Img";
import { ReservasForm } from "@/components/ReservasForm";
import { WebsiteMedia } from "@/models/website_media";

interface ReservasPageProps {
  websiteMedia: WebsiteMedia;
  homeTitles: any;
}

export default function ReservasPage({
  homeTitles,
  websiteMedia,
}: ReservasPageProps) {
  const { t, i18n } = useTranslation("translations");

  return (
    <div className="flex justify-center flex-col items-center m-10 md:m-20">
      <div className="relative m-5 flex justify-center">
        {websiteMedia.value ? (
          <Img
            className={`brightness-50 object-cover h-[500px] rounded-lg w-full `}
            src={websiteMedia.value}
            alt={websiteMedia.alt_text}
          />
        ) : null}
        <h4
          className={`absolute font-sans font-bold flex flex-col  justify-center  brightness-100 text-2xl md:text-4xl text-gray-50  h-full  text-center w-2/3  uppercase ${homeTitles?.territorialReservations_mainTitle?.className}`}
        >
          {i18n.language === "en"
            ? homeTitles?.territorialReservations_mainTitle?.value_en
            : homeTitles?.territorialReservations_mainTitle?.value}
        </h4>
      </div>

      <p className="p-5 md:p-10">{t("landReservesDescription")}</p>
      <ReservasForm t={t} />
    </div>
  );
}
