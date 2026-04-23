"use client";
import Favorites from "@/components/Favourites";
import { type LocationHierarchy } from "@/models/location_hierarchy";
import { toUrlCase } from "@/utils/common.utils";
import { Icon } from "@iconify/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DesktopMenuLink } from "./DesktopMenuLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

import { useAuthStore } from "@/stores/useAuthStore";

interface MobileMenuProps {
  className?: string;
  dataDesarrollos?: LocationHierarchy[];
  cities?: LocationHierarchy["ciudades"] | null;
  projects?: LocationHierarchy["ciudades"][number]["proyectos"] | null;
  selectedCity: number | null;
  setSelectedCity: (id: number | null) => void;
  selectedState: number | null;
  setSelectedState: (id: number | null) => void;
  setIsMenuOpen: (open: boolean) => void;
  links: Array<{ name: string; path: string }>;
}

export function MobileMenu({
  className,
  dataDesarrollos,
  cities,
  projects,
  selectedCity,
  setSelectedCity,
  selectedState,
  setSelectedState,
  setIsMenuOpen,
  links,
}: MobileMenuProps) {
  const { t, i18n } = useTranslation("translations");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const [favoritesOpen, setFavoritesOpen] = useState(false);

  return (
    <div
      className={`w-full h-full flex flex-col gap-4 px-4 py-4  ${className}`}
    >
      <div className="[&>*]:font-display [&>*]:cursor-pointer flex items-center gap-2">
        <div
          onClick={() => {
            i18n.changeLanguage("es");
          }}
          className={i18n.language === "es" ? "text-accent" : ""}
          aria-label="Cambiar a español"
        >
          ES
        </div>
        |
        <div
          onClick={() => {
            i18n.changeLanguage("en");
          }}
          aria-label="Cambiar a inglés"
          className={i18n.language === "en" ? "text-accent" : ""}
        >
          EN
        </div>
      </div>
      <NavigationMenu className="w-full max-w-full items-stretch flex-col">
        <NavigationMenuList className="gap-2 flex-col items-start w-full [&>*]:py-4 [&>*]:w-full [&>*]:!mx-0">
          <NavigationMenuItem>
            <Accordion type="single" collapsible>
              <AccordionItem
                value="item-1"
                className="border-none [&[data-state=open]]:bg-neutral-100 [&[data-state=open]]:p-2 rounded transition-all"
              >
                <AccordionTrigger className="font-normal text-base p-0 hover:text-accent hover:no-underline [&[data-state=open]]:text-accent font-display">
                  {t("developments")}
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  {!selectedState && (
                    <div>
                      {dataDesarrollos?.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (selectedState === item.id) {
                              setSelectedState(null);
                            } else {
                              setSelectedState(item.id);
                            }

                            setSelectedCity(null);
                          }}
                          className={`transition-all text-foreground-soft text-base  px-4 py-2 cursor-pointer flex flex-row justify-between items-center font-display font-extrabold lg:font-normal ${selectedState === item.id ? "!text-accent" : ""
                            }`}
                        >
                          {item.name}
                          <ChevronRight className="h-6 w-6 inline-block" />
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedState && !selectedCity && (
                    <div>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedCity(null);
                          setSelectedState(null);
                        }}
                      >
                        <Icon
                          icon="heroicons:arrow-left"
                          width="24"
                          className="mr-2"
                        />
                        {t("back")}
                      </Button>
                      {cities?.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (selectedCity === item.id) {
                              setSelectedCity(null);
                            } else {
                              setSelectedCity(item.id);
                            }
                          }}
                          className={`transition-all text-foreground-soft font-display text-base px-4 py-2 cursor-pointer flex flex-row justify-between items-center font-extrabold lg:font-normal ${selectedCity === item.id ? "!text-accent" : ""
                            }`}
                        >
                          {item.name}
                          <ChevronRight className="h-8 w-8 inline-block" />
                        </div>
                      ))}
                      <Button className="mt-4" variant="ghost" asChild>
                        <Link
                          href={`/estados/${toUrlCase(
                            dataDesarrollos?.find(
                              (item) => item.id === selectedState
                            )?.name ?? ""
                          )}`}
                          onClick={() => {
                            setIsMenuOpen(false);
                          }}
                        >
                          {t("seeAll")}
                          <Icon
                            icon="heroicons:arrow-right"
                            width="24"
                            className="ml-2"
                          />
                        </Link>
                      </Button>
                    </div>
                  )}
                  {selectedCity && (
                    <div>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedCity(null);
                        }}
                      >
                        <Icon
                          icon="heroicons:arrow-left"
                          width="24"
                          className="mr-2"
                        />
                        {t("back")}
                      </Button>

                      {projects?.map((item) => (
                        <DesktopMenuLink
                          project={item}
                          setIsMenuOpen={setIsMenuOpen}
                          key={item.id}
                        />
                      ))}
                      <Button className="mt-4" variant="ghost" asChild>
                        <Link
                          href={`/estados/${toUrlCase(
                            dataDesarrollos?.find(
                              (item) => item.id === selectedState
                            )?.name ?? ""
                          )}?zona=${toUrlCase(
                            cities?.find((item) => item.id === selectedCity)
                              ?.name ?? ""
                          )}`}
                          onClick={() => {
                            setIsMenuOpen(false);
                          }}
                        >
                          {t("seeAll")}
                          <Icon
                            icon="heroicons:arrow-right"
                            width="24"
                            className="ml-2"
                          />
                        </Link>
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </NavigationMenuItem>

          {links.map((link) => (
            <NavigationMenuItem key={link.path} className="hover:text-accent">
              <NavigationMenuLink asChild>
                <Link
                  href={link.path}
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="font-display"
                >
                  {link.name}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="grow" />
      {isAuthenticated && (
        <>
          <Button
            variant="outline"
            onClick={() => {
              setFavoritesOpen(true);
            }}
          >
            <Icon icon="heroicons-solid:heart" width="24" className="mr-2" />
            {t("myFavorites")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
          >
            {t("logout")}
          </Button>
        </>
      )}
      {favoritesOpen && (
        <Favorites
          onClose={() => {
            setFavoritesOpen(false);
          }}
        />
      )}
    </div>
  );
}
