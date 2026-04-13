"use client";

import "@/i18n";
import { getSNS, getTitlesBySection } from "@/utils/api";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const isAbsoluteUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://");

const normalizeHostname = (hostname: string) =>
  hostname.toLowerCase().replace(/^www\./, "");

const INTERNAL_PUBLIC_HOSTS = new Set(["javer.com.mx"]);

const toRelativeIfCurrentHostUrl = (value: string, currentHost: string | null) => {
  const trimmed = value.trim();
  if (!isAbsoluteUrl(trimmed)) return trimmed;
  if (!currentHost) return value;

  try {
    const url = new URL(trimmed);
    const targetHost = normalizeHostname(url.hostname);
    const hostIsCurrent = targetHost === normalizeHostname(currentHost);
    const hostIsKnownInternal = INTERNAL_PUBLIC_HOSTS.has(targetHost);

    if (hostIsCurrent || hostIsKnownInternal) {
      return `${url.pathname}${url.search}${url.hash}` || "/";
    }
    return trimmed;
  } catch {
    return trimmed;
  }
};

const getSocialIconName = (value: string) => {
  const normalized = value.toLowerCase().trim();
  if (normalized.includes(":")) return normalized;
  if (normalized === "facebook") return "mdi:facebook";
  if (normalized === "instagram") return "mdi:instagram";
  if (normalized === "youtube") return "mdi:youtube";
  if (normalized === "linkedin") return "mdi:linkedin";
  if (normalized === "tiktok") return "ic:baseline-tiktok";
  return "mdi:web";
};

// interface FooterProps {
//   initialData: FooterType[];
// }

export default function Footer() {
  const { t, i18n } = useTranslation("translations");
  const [currentHost, setCurrentHost] = useState<string | null>(null);

  useEffect(() => {
    setCurrentHost(window.location.hostname);
  }, []);

  // const footerSections = initialData;

  const { data: sns } = useQuery({
    queryKey: ["getSNS"],
    queryFn: async () => await getSNS(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: sectionHeaders } = useQuery({
    queryKey: ["getSectionHeaders"],
    queryFn: async () => await getTitlesBySection("footer"),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // const companyLinks = useMemo(() => {
  //   return footerSections
  //     .filter((item) => item.active === 1 && item.section === "company")
  //     .map((item) => ({
  //       id: item.id,
  //       path: item.path,
  //       name: item.name,
  //       name_eng: item.name_eng,
  //       open_in_new_tab: item.is_url,
  //     }));
  // }, [footerSections]);

  // const investorLinks = useMemo(() => {
  //   return footerSections
  //     .filter((item) => item.active === 1 && item.section === "investors")
  //     .map((item) => ({
  //       id: item.id,
  //       path: item.path,
  //       name: item.name,
  //       name_eng: item.name_eng,
  //       open_in_new_tab: item.is_url,
  //     }));
  // }, [footerSections]);

  // const infoLinks = useMemo(() => {
  //   return footerSections
  //     .filter((item) => item.active === 1 && item.section === "info")
  //     .map((item) => ({
  //       id: item.id,
  //       path: item.path,
  //       name: item.name,
  //       name_eng: item.name_eng,
  //       open_in_new_tab: item.is_url,
  //     }));
  // }, [footerSections]);

  // const clientLinks = useMemo(() => {
  //   return footerSections
  //     .filter((item) => item.active === 1 && item.section === "client")
  //     .map((item) => ({
  //       id: item.id,
  //       path: item.path,
  //       name: item.name,
  //       name_eng: item.name_eng,
  //       open_in_new_tab: item.is_url,
  //     }));
  // }, [footerSections]);
  interface AddressItemProps {
    ciudad: string;
    direccion: string;
    colonia: string;
    estado: string;
    telefono1: string;
    telefono2?: string;
    referencias?: string;
  }

  function AddressItem({
    ciudad,
    direccion,
    colonia,
    estado,
    telefono1,
    telefono2,
    referencias,
  }: AddressItemProps) {
    return (
      <div className="flex flex-col gap-1 text-neutral-400 text-sm">
        <p className="text-white font-semibold">{ciudad}</p>
        <p>{direccion}</p>
        {referencias && <p>{referencias}</p>}
        <p>{colonia}</p>
        <p>{estado}</p>
        <p>
          Tel. {telefono1}
          {telefono2 && ` y ${telefono2}`}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 text-white pt-12">
      <div className="flex flex-col gap-8 container">

        {/* 🔹 DIRECCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <AddressItem
            ciudad="Hermosillo"
            direccion="Napoles #4 Esq. Emilio Beraud"
            colonia="Col. Centenario"
            estado="Hermosillo, Sonora"
            telefono1="(662) 212 1242"
            telefono2="44"
          />

          <AddressItem
            ciudad="Tijuana"
            direccion="Av. Batopilas #2331"
            referencias="entre Brasil y Colombia"
            colonia="Col. Francisco I. Madero"
            estado="Tijuana, Baja California"
            telefono1="(664) 608 7070"
            telefono2="638 4698"
          />

          <AddressItem
            ciudad="Nogales"
            direccion="Gandarillas #3"
            colonia="Col. Serena Residencial"
            estado="Nogales, Sonora"
            telefono1="(631) 314 8184"
            telefono2="314 7834"
          />

        </div>

        {/* 🔹 REDES + LOGO */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">

          {/* Redes */}
          <div>
            <h5 className="text-base font-bold font-roboto">
              {t("followUs")}
            </h5>

            <div className="flex flex-row gap-4 mt-2 flex-wrap">
              {(sns?.data ?? []).map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full cursor-pointer"
                >
                  {isAbsoluteUrl(item.icon) ? (
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Icon
                      icon={getSocialIconName(item.icon)}
                      width="24"
                      className="text-white"
                    />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-start lg:justify-end w-full lg:w-auto">
            <Image
              src="/images/logo-derex-blanco.png"
              alt="Derex"
              width={176}
              height={176}
              className="w-44 h-auto"
              style={{ height: "auto" }}
            />
          </div>

        </div>

        {/* 🔹 CERTIFICACIONES */}
        <div className="flex flex-col gap-8">
          <hr className="border-white" />

          <div className="flex flex-col lg:flex-row gap-8 items-center pb-12 w-full">

            <Image src="/images/footer/vinte-logo.webp" alt="grupo vinte" width={64} height={64} className="h-16 w-auto" style={{ width: "auto" }} />
            <Image src="/images/footer/great-place-to-work.webp" alt="great place to work" width={64} height={64} className="h-16 w-auto" style={{ width: "auto" }} />
            <Image src="/images/footer/esr.webp" alt="empresa socialmente responsable" width={64} height={64} className="h-16 w-auto" style={{ width: "auto" }} />
            <Image src="/images/footer/empresa-socialmente-responsable.webp" alt="edge" width={64} height={64} className="h-16 w-auto" style={{ width: "auto" }} />
            <Image src="/images/footer/super-empresas-top.webp" alt="super empresas top" width={64} height={64} className="h-16 w-auto" style={{ width: "auto" }} />
            <Image src="/images/footer/mejores-empresas-mexicanas.webp" alt="mejores empresas mexicanas" width={64} height={64} className="h-16 w-auto" style={{ width: "auto" }} />

            <p className="text-sm font-display ml-0 lg:ml-auto whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] lg:max-w-full">
              {i18n.language === "en"
                ? sectionHeaders?.footer_copyrigth?.value_en
                : sectionHeaders?.footer_copyrigth?.value}
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
