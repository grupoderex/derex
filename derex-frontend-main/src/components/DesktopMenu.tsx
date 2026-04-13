import { type LocationHierarchy } from "@/models/location_hierarchy";
import { toUrlCase } from "@/utils/common.utils";
import { Icon } from "@iconify/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { DesktopMenuLink } from "./DesktopMenuLink";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface DesktopMenuProps {
  className?: string;
  dataDesarrollos?: LocationHierarchy[];
  cities?: LocationHierarchy["ciudades"] | null;
  projects?: LocationHierarchy["ciudades"][number]["proyectos"] | null;
  selectedCity: number | null;
  setSelectedCity: (id: number | null) => void;
  selectedState: number | null;
  setSelectedState: (id: number | null) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export function DesktopMenu({
  className,
  dataDesarrollos,
  cities,
  projects,
  selectedCity,
  setSelectedCity,
  selectedState,
  setSelectedState,
  setIsMenuOpen,
}: DesktopMenuProps) {
  const { t } = useTranslation("translations");
  return (
    <div className={`w-full flex flex-row h-full ${className} `}>
      <ScrollArea
        className={`pl-10 pt-4 bg-neutral-100 h-full w-1/3 border-border`}
      >
        <h5 className="mx-8 border-l-[1px] border-foreground px-4 font-bold font-display text-lg lg:text-2xl">
          {t("states")}
        </h5>
        <div className="ml-10 mt-4">
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
              className={`transition-all text-foreground-soft px-4 cursor-pointer flex flex-row justify-between items-center font-bold font-display ${
                selectedState === item.id ? "!text-accent ml-2" : ""
              }`}
            >
              <div
                className="font-dis font-bold h-full select-none py-2"
                onMouseEnter={() => {
                  setSelectedState(item.id);

                  setSelectedCity(null);
                }}
              >
                {item.name}
              </div>
              {selectedState === item.id && (
                <div>
                  <ChevronRight className="h-8 w-8 inline-block" />
                  <ChevronRight className="h-8 w-8 inline-block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea className={`pl-10 pt-4 border-l h-full w-1/3 border-border`}>
        <h5 className="mx-8 border-l-[1px] border-foreground px-4 font-bold font-display text-lg lg:text-2xl">
          {t("zones")}
        </h5>
        <div className="ml-10 mt-4">
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
              className={`transition-all  text-foreground-soft px-4 cursor-pointer flex flex-row justify-between items-center font-bold font-display ${
                selectedCity === item.id ? "!text-accent ml-2" : ""
              }`}
            >
              <div
                className="h-full select-none py-2 font-display"
                onMouseEnter={() => {
                  setSelectedCity(item.id);
                }}
              >
                <p className="font-bold font-display">{item.name}</p>
              </div>
              {selectedCity === item.id && (
                <div>
                  <ChevronRight className="h-8 w-8 inline-block" />
                  <ChevronRight className="h-8 w-8 inline-block" />
                </div>
              )}
            </div>
          ))}
          {cities && (
            <Button className="mt-4" variant="ghost" asChild>
              <Link
                className="font-roboto flex items-center"
                href={`/estados/${toUrlCase(
                  dataDesarrollos?.find((item) => item.id === selectedState)
                    ?.name ?? ""
                )}`}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                {t("seeAll")}
                <Icon
                  icon="heroicons-solid:arrow-right"
                  className="ml-2"
                  width="20"
                />
              </Link>
            </Button>
          )}
        </div>
      </ScrollArea>
      <ScrollArea
        className={`pl-10 pt-4 border-l h-full transition-all w-1/3 border-border`}
      >
        <h5 className="mx-8 border-l-[1px] border-foreground px-4 font-bold font-display text-lg lg:text-2xl">
          {t("housingDevelopments")}
        </h5>
        <div className="ml-10 mt-4">
          {projects?.map((item) => (
            <DesktopMenuLink
              project={item}
              setIsMenuOpen={setIsMenuOpen}
              key={item.id}
            />
          ))}
          {projects && (
            <Button className="mt-4 " variant="ghost" asChild>
              <Link
                className="font-roboto"
                href={`/estados/${toUrlCase(
                  dataDesarrollos?.find((item) => item.id === selectedState)
                    ?.name ?? ""
                )}?zona=${toUrlCase(
                  cities?.find((item) => item.id === selectedCity)?.name ?? ""
                )}`}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                {t("seeAll")}
                <Icon
                  icon="heroicons-solid:arrow-right"
                  className="ml-2"
                  width="20"
                />
              </Link>
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
