import { Tag } from "../components/shared/Tag";
import { DevelopmentOrientationIcon } from "./icons/DevelopmentOrientationIcon";
import { Button } from "./ui/button";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import {
  Tooltip,
  TooltipPortal,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
} from "@radix-ui/react-tooltip";
import {
  type AmenityNextLaunch,
  type NextLaunch,
} from "@/models/nextLauches.inteface";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactDialog } from "./ui/ContactDialog";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@radix-ui/react-menubar";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

dayjs.locale("es");

export default function NextLaunchCard({
  nextLaunch,
}: {
  nextLaunch: NextLaunch;
}) {
  const [openMenuResponsive, setOpenMenuResponsive] = useState(false);

  const { t, i18n } = useTranslation("translations");

  const amenitiesTrimmed = nextLaunch.amenities.length
    ? nextLaunch.amenities
    : [];

  const amenitiesInside = nextLaunch.amenities.length
    ? nextLaunch.amenities.slice(0, 3)
    : [];
  function handleTextClick(event: React.MouseEvent<HTMLParagraphElement>) {
    event.stopPropagation();
    setOpenMenuResponsive(() => !openMenuResponsive);
  }

  return (
    <div className="w-[300px] h-[380px] bg-white rounded-xl shadow-card flex flex-col justify-between">
      <div className="w-full min-h-[110px] rounded-t-xl relative">
        <div className="absolute top-4 right-4 z-10">
          <Tag configTag={{ title: t("comingSoon"), animation: false }} />
        </div>

        {nextLaunch.main_image ? (
          <Image
            fill
            quality={80}
            loading="lazy"
            className="rounded-t-xl"
            src={nextLaunch.main_image ?? "/images/recorrido-virtual.png"}
            alt={nextLaunch.main_image_alt ?? "main_image_alt"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        ) : null}

        {nextLaunch.secondary_image && (
          <div className="absolute bottom-4 left-4 rounded-md flex flex-row items-center w-20 h-20 overflow-hidden">
            {nextLaunch.secondary_image_alt ? (
              <Image
                fill
                objectFit="cover"
                objectPosition="center"
                quality={80}
                loading="lazy"
                src={nextLaunch.secondary_image}
                alt={nextLaunch.secondary_image_alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            ) : null}
          </div>
        )}
      </div>

      <div className="px-4 w-full max-h-[180px] min-h-[180px] flex flex-col gap-4">
        <div className="flex flex-row items-center gap-3">
          <DevelopmentOrientationIcon
            orientation={nextLaunch.type ?? "vertical"}
            className="inline-block min-h-6 min-w-6"
            size={32}
          />

          <TooltipProvider delayDuration={0} skipDelayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xl font-display text-center whitespace-nowrap overflow-hidden text-ellipsis font-bold">
                  {nextLaunch.name}
                </p>
              </TooltipTrigger>
              {nextLaunch.name.length > 30 && (
                <TooltipPortal>
                  <TooltipContent
                    side="bottom"
                    className="bg-primary rounded-md p-2 text-sm flex flex-col gap-2"
                  >
                    <p className="text-base font-display text-center text-white ">
                      {nextLaunch.name}
                    </p>
                    <TooltipArrow />
                  </TooltipContent>
                </TooltipPortal>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-row items-center gap-3">
          <Image
            width={24}
            height={24}
            src="/images/iconos/map.svg"
            alt="map"
            className="object-cover"
          />
          <p className="font-display font-bold text-center text-primary text-xs">
            {nextLaunch.city_name ? `${nextLaunch.city_name}, ` : ""}
            {nextLaunch.state_name}{" "}
          </p>
        </div>

        <div className="flex flex-row items-center gap-3 text-base">
          <p className="font-roboto"> {t("launch")}: </p>

          <div className="rounded-full bg-neutral-200 px-2 py-1 text-sm">
            <p className="font-roboto font-bold text-sm">
              {nextLaunch.launch_date
                ? `${dayjs(nextLaunch.launch_date).format("YYYY")}`
                    .charAt(0)
                    .toUpperCase() +
                  dayjs(nextLaunch.launch_date).format("YYYY").slice(1)
                : t("soon")}
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3  lg:hidden">
            <Menubar
              onClick={handleTextClick}
              className="border-0 lg:hidden block"
            >
              <MenubarMenu>
                {amenitiesTrimmed.length > 0 && (
                  <MenubarTrigger className="bg-white flex flex-row items-center gap-2">
                    <Image
                      src="/images/iconos/infoAmenities.svg"
                      alt="map"
                      width={16}
                      height={16}
                      className="object-cover cursor-pointer"
                    />

                    <p className="text-sm  font-roboto ">
                      <span className="!font-bold">{`${amenitiesTrimmed.length}`}</span>
                      {`
                      
                      ${String(
                        amenitiesTrimmed.length === 1
                          ? t("amenity")
                          : t("amenities")
                      )}`}
                    </p>
                  </MenubarTrigger>
                )}

                {openMenuResponsive && (
                  <MenubarContent className="px-2 py-1 flex flex-col gap-2 bg-primary max-w-[250px] shadow-lg  rounded-md z-50 ">
                    <span className="text-white text-xs">
                      {t("principals")}
                    </span>
                    <div className="flex flex-col flex-wrap ml-3">
                      {amenitiesInside.map(
                        (amenity: AmenityNextLaunch, index: number) => (
                          <ul key={index} className="list-disc text-white">
                            <li className="text-xs font-roboto">
                              <MenubarItem className="text-white">
                                {i18n.language === "en"
                                  ? amenity?.name_en
                                  : amenity?.name_es}
                              </MenubarItem>
                            </li>
                          </ul>
                        )
                      )}
                    </div>
                    {amenitiesTrimmed.length > 3 && (
                      <>
                        <span className="text-white text-xs !font-bold">
                          {t("and")}{" "}
                          {amenitiesTrimmed.length - amenitiesInside.length}{" "}
                          {t("more")}.
                        </span>
                      </>
                    )}
                  </MenubarContent>
                )}
              </MenubarMenu>
            </Menubar>
          </div>

          <div className=" flex-row items-center gap-3 hidden lg:flex">
            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image
                    width={16}
                    height={16}
                    src="/images/iconos/infoAmenities.svg"
                    alt="map"
                    className="object-cover cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent
                    side="top"
                    className="bg-primary p-2 text-sm flex flex-col gap-2 rounded-md min-w-[120px]"
                  >
                    <span className="text-white text-xs">
                      {t("principals")}
                    </span>
                    {amenitiesInside.map(
                      (amenity: AmenityNextLaunch, index: number) => (
                        <ul key={index} className="ml-3">
                          <li className="text-white text-xs font-roboto list-disc">
                            {i18n.language === "en"
                              ? amenity?.name_en
                              : amenity?.name_es}
                          </li>
                        </ul>
                      )
                    )}

                    {amenitiesTrimmed.length > 3 && (
                      <>
                        <span className="text-white text-xs">
                          {t("and")}{" "}
                          {amenitiesTrimmed.length - amenitiesInside.length}{" "}
                          {t("more")}.
                        </span>
                      </>
                    )}

                    <TooltipArrow />
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>

            <p className="text-sm font-normal font-roboto">
              <span className="font-bold">{amenitiesTrimmed.length}</span>
              {`${" "}${String(
                amenitiesTrimmed.length === 1 ? t("amenity") : t("amenities")
              )}`}
            </p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <Icon icon="heroicons:phone" width="18" className="text-primary" />

            <a
              className="text-sm font-normal font-roboto"
              href={`tel:${nextLaunch.contact_phone}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {nextLaunch.contact_phone}
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-end pb-2 pr-2 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button asChild variant="ghost">
              <Link href={""} className="font-roboto text-sm">
                {t("contactUs")}
                <Icon
                  icon="heroicons:arrow-right"
                  width="24"
                  className="ml-2"
                />
              </Link>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-auto w-[90%] max-h-[80%]  overflow-scroll ">
            <DialogTitle>
              <h4 className="text-3xl font-display font-bold">
                {t("knowMoreBoutIt")}
              </h4>
            </DialogTitle>
            <ContactDialog
              idFutureProject={nextLaunch.id}
              uniqueUrl={nextLaunch.unique_url}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
