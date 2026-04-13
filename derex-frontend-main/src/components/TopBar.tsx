"use client";
import { type Translation } from "@/types/translation";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { useWindowScroll } from "@uidotdev/usehooks";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DesktopMenuByState } from "../components/DesktopMenuByState";
import { MobileMenu } from "../components/MobileMenu";
import i18n from "../i18n/index";
import Favorites from "./Favourites";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Popover, PopoverContent } from "./ui/popover";

import { LocationHierarchy } from "@/models/location_hierarchy";
import { Navbar } from "@/models/section";
import { getInitialDataDesarrollos } from "@/utils/api";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";

export default function TopBar({
  initialData,
  initialDesarrollos,
}: {
  initialData: Navbar[];
  initialDesarrollos?: LocationHierarchy[];
}) {
  const [{ y }] = useWindowScroll();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedState2, setSelectedState2] = useState<number | null>(null);
  const [selectedCity2, setSelectedCity2] = useState<number | null>(null);
  const desktopMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  const { data: dataDesarrollos } = useQuery({
    queryKey: ["desarrollos"],
    queryFn: getInitialDataDesarrollos,
    initialData: initialDesarrollos,
    staleTime: initialDesarrollos?.length ? 1000 * 60 * 5 : 0,
  });

  const navbarSections = initialData;

  const cities = useMemo(() => {
    if (selectedState === null) {
      return null;
    }
    return dataDesarrollos?.find((item) => item.id === selectedState)?.ciudades;
  }, [dataDesarrollos, selectedState]);

  const projects = useMemo(() => {
    if (selectedCity === null) {
      return null;
    }
    return (
      cities
        ?.find((item) => item.id === selectedCity)
        ?.proyectos?.filter((it) => it.active === 1) ?? []
    );
  }, [cities, selectedCity]);

  const projects2 = useMemo(() => {
    if (selectedCity2 === null) return null;
    return (
      dataDesarrollos
        ?.flatMap((s) => s.ciudades)
        .find((c) => c.id === selectedCity2)
        ?.proyectos?.filter((p) => p.active === 1) ?? []
    );
  }, [dataDesarrollos, selectedCity2]);

  useEffect(() => {
    setIsHydrated(true);

    const onLanguageChanged = (language: string) => {
      setCurrentLanguage(language || "es");
    };

    onLanguageChanged(i18n.language);
    i18n.on("languageChanged", onLanguageChanged);

    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, []);

  useEffect(() => {
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedState2(null);
    setSelectedCity2(null);
  }, [isMenuOpen]);

  const links = useMemo(() => {
    if (!isHydrated) {
      return navbarSections
        .filter((item) => item.active === 1)
        .map((item) => ({
          name: item.name,
          path: item.path,
        }));
    }

    const isEnglish = currentLanguage === "en";

    return navbarSections
      .filter((item) => item.active === 1)
      .map((item) => {
        const englishValue = item.name_eng ?? item.name;
        const translated = i18n.t(englishValue as keyof Translation);
        const hasTranslation = translated !== englishValue;

        return {
          name: hasTranslation
            ? translated
            : isEnglish
              ? englishValue
              : item.name,
          path: item.path,
        };
      });
  }, [isHydrated, navbarSections, currentLanguage]);

  const languageForUI = isHydrated ? currentLanguage : "es";
  const developmentsLabel = isHydrated
    ? i18n.t("developments" as keyof Translation)
    : "Desarrollos disponibles";
  const isScrolled = isHydrated && (y ?? 0) > 1;

  const toggleDesktopMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }

    setIsMenuOpen(true);
  };

  return (
    <>
      <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <div className="sticky top-0 left-0 z-40">
          <div
            className={`px-4 lg:px-14 pt-5 pb-6 flex flex-row gap-4  transition-all ${isMenuOpen ? "bg-white" : ""
              } ${isScrolled
                ? "bg-white shadow-md"
                : "bg-gradient-to-b from-white"
              }`}
          >
            <Link href="/">
              <Image
                src="/images/derex-logo.webp"
                alt="logo"
                width={176}
                height={44}
                className="h-auto w-28 lg:w-44"
                style={{ height: "auto" }}
                priority
              />
            </Link>
            <div className="grow hidden lg:flex flex-row items-center justify-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-6">

                  <NavigationMenuItem>
                    <button
                      ref={desktopMenuButtonRef}
                      type="button"
                      className="flex flex-row items-center gap-1 hover:text-accent font-roboto cursor-pointer font-bold"
                      onClick={toggleDesktopMenu}
                      aria-expanded={isMenuOpen}
                    >
                      {developmentsLabel}
                      <ChevronDown
                        className={`relative top-[1px] h-6 w-6 transition duration-200 ${isMenuOpen ? "rotate-180" : ""
                          }`}
                        aria-hidden="true"
                      />
                    </button>
                  </NavigationMenuItem>
                  {links.map((link) => (
                    <NavigationMenuItem key={link.path}>
                      <NavigationMenuLink
                        asChild
                        className="hover:text-accent font-roboto font-bold"
                      >
                        <Link href={link.path}>{link.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="hidden lg:flex flex-row gap-6 items-center">
              {/* <Icon
                icon="heroicons:user"
                width="24"
                className="cursor-pointer"
                onClick={() => {
                  openLoginModal();
                }}
              /> */}
              {/* {isAuthenticated && (
                <Icon
                  icon="heroicons-solid:heart"
                  width="24"
                  className="text-red-600 cursor-pointer"
                  onClick={() => {
                    setFavoritesOpen(true);
                  }}
                />
              )} */}
              <div className="[&>*]:font-roboto [&>*]:cursor-pointer flex items-center gap-2">
                <div
                  onClick={() => {
                    i18n.changeLanguage("es");
                  }}
                  className={
                    languageForUI === "es"
                      ? "text-accent font-bold"
                      : "font-bold"
                  }
                  aria-label="Cambiar a español"
                >
                  ES
                </div>
                |
                <div
                  onClick={() => {
                    i18n.changeLanguage("en");
                  }}
                  className={
                    languageForUI === "en"
                      ? "text-accent font-bold"
                      : "font-bold"
                  }
                  aria-label="Cambiar a inglés"
                >
                  EN
                </div>
              </div>
            </div>
            <div className="lg:hidden flex flex-row items-center justify-end grow">
              {!isMenuOpen && (
                <Icon
                  icon="heroicons:bars-3"
                  width="24"
                  className="cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(true);
                  }}
                />
              )}
              {isMenuOpen && (
                <Icon
                  icon="heroicons:x-mark"
                  width="24"
                  className="cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                />
              )}
            </div>
          </div>
          <PopoverAnchor />
        </div>
        <PopoverContent
          className="rounded-none overflow-hidden h-[calc(100vh-78px)] w-screen p-0 lg:left-1/2 lg:h-[300px] lg:w-[1120px] lg:max-w-[92vw]"
          sideOffset={-2}
          onInteractOutside={(event) => {
            const target = event.target as Node;
            if (desktopMenuButtonRef.current?.contains(target)) {
              event.preventDefault();
            }
          }}
        >
          <DesktopMenuByState
            className="max-lg:hidden"
            dataDesarrollos={dataDesarrollos ?? []}
            projects={projects2}
            selectedCity={selectedCity2}
            setSelectedCity={setSelectedCity2}
            selectedState={selectedState2}
            setSelectedState={setSelectedState2}
            setIsMenuOpen={setIsMenuOpen}
          />

          <MobileMenu
            className="lg:hidden"
            links={links}
            dataDesarrollos={dataDesarrollos ?? []}
            cities={cities}
            projects={projects}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            setIsMenuOpen={setIsMenuOpen}
          />
        </PopoverContent>
      </Popover>
      {favoritesOpen && (
        <Favorites
          onClose={() => {
            setFavoritesOpen(false);
          }}
        />
      )}
    </>
  );
}
