import { type LocationHierarchy } from "@/models/location_hierarchy";
import { toUrlCase } from "@/utils/common.utils";
import { Icon } from "@iconify/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { DesktopMenuLink } from "./DesktopMenuLink";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface DesktopMenuByStateProps {
  className?: string;
  dataDesarrollos?: LocationHierarchy[];
  projects?: LocationHierarchy["ciudades"][number]["proyectos"] | null;
  selectedCity: number | null;
  setSelectedCity: (id: number | null) => void;
  selectedState: number | null;
  setSelectedState: (id: number | null) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export function DesktopMenuByState({
  className,
  dataDesarrollos,
  projects,
  selectedCity,
  setSelectedCity,
  selectedState,
  setSelectedState,
  setIsMenuOpen,
}: DesktopMenuByStateProps) {
  const { t } = useTranslation("translations");

  const selectedStateName =
    dataDesarrollos?.find((s) => s.id === selectedState)?.name ?? "";
  const selectedCityName =
    dataDesarrollos
      ?.flatMap((s) => s.ciudades)
      .find((c) => c.id === selectedCity)?.name ?? "";

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="h-full w-full max-w-5xl overflow-hidden rounded-md border border-border bg-white flex flex-row">
        <ScrollArea className="pt-4 bg-neutral-100 h-full w-[48%] border-border px-4 lg:px-6">
          <h5 className="mx-2 border-l-[1px] border-foreground px-4 font-bold font-display text-lg lg:text-2xl">
            {t("zones")}
          </h5>
          <div className="mt-4">
          {dataDesarrollos?.map((state) => {
            const activeCities = state.ciudades.filter((c) => c.active === 1);
            if (activeCities.length === 0) return null;
            return (
              <div key={state.id} className="mb-2">
                <div className="flex items-center justify-between pr-4">
                  <p className="px-4 py-1 text-xs font-bold font-display uppercase text-foreground/50 tracking-wider mt-2">
                    {state.name}
                  </p>

                </div>
                {activeCities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => {
                      setSelectedState(state.id);
                      if (selectedCity === city.id) {
                        setSelectedCity(null);
                      } else {
                        setSelectedCity(city.id);
                      }
                    }}
                    className={`transition-all text-foreground-soft px-4 cursor-pointer flex flex-row justify-between items-center font-bold font-display ${
                      selectedCity === city.id ? "!text-accent ml-2" : ""
                    }`}
                  >
                    <div
                      className="h-full select-none py-2 font-display w-full"
                      onMouseEnter={() => {
                        setSelectedState(state.id);
                        setSelectedCity(city.id);
                      }}
                    >
                      <p className="font-bold font-display">{city.name}</p>
                    </div>
                    {selectedCity === city.id && (
                      <div>
                        <ChevronRight className="h-8 w-8 inline-block" />
                        {/* <ChevronRight className="h-8 w-8 inline-block" /> */}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
          </div>
        </ScrollArea>

        <ScrollArea className="pt-4 border-l h-full transition-all w-[52%] border-border px-4 lg:px-6">
          <h5 className="mx-2 border-l-[1px] border-foreground px-4 font-bold font-display text-lg lg:text-2xl">
            {t("housingDevelopments")}
          </h5>
          <div className="mt-4">
            {projects?.map((item) => (
              <DesktopMenuLink
                project={item}
                setIsMenuOpen={setIsMenuOpen}
                key={item.id}
              />
            ))}
            {projects && (
              <Button className="mt-4" variant="ghost" asChild>
                <Link
                  className="font-roboto"
                  href={`/estados/${toUrlCase(selectedStateName)}?zona=${toUrlCase(selectedCityName)}`}
                  onClick={() => setIsMenuOpen(false)}
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
    </div>
  );
}
