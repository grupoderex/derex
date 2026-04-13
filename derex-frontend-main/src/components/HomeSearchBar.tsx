import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "./ui/card";

import { useEffect, useMemo, useState } from "react";
import { LinkButton } from "./shared/LinkButton";

interface HomeSearchBarProps {
  selectedState?: string;
  developments: any[];
  homeTitles: any;
}

export function HomeSearchBar({
  selectedState,
  developments,
  homeTitles,
}: HomeSearchBarProps) {
  const { t, i18n } = useTranslation("translations");

  const [state, setState] = useState<string | undefined>(selectedState);
  const [zone, setZone] = useState<string | undefined>();
  const [price, setPrice] = useState<number | undefined>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (selectedState) setState(selectedState);
  }, [selectedState]);

  // 2. Optimización: Memoizar zonas para evitar cálculos en cada render
  const availableZones = useMemo(() => {
    return developments?.find((d) => d.name === state)?.ciudades ?? [];
  }, [state, developments]);

  return (
    <Card className="text-card-foreground bg-card/80 rounded-lg shadow-card w-full lg:max-w-max mx-auto min-h-[200px]">
      <CardHeader className="px-8 flex flex-row items-center ">
        <h2
          className={`!text-2xl lg:!text-4xl font-display font-bold text-center ${homeTitles?.home_search?.className}`}
        >
          {i18n.language === "en"
            ? homeTitles?.home_search?.value_en
            : homeTitles?.home_search?.value}
        </h2>
      </CardHeader>
      <CardContent className="px-8 pb-6 text-md ">
        <p className="font-roboto">{t("findYourNewHomeDescription") ?? ""}</p>
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
      <LinkButton to="/estados/sonora">
      Desarrollos en Sonora
      </LinkButton>
      <LinkButton to="/estados/baja-california">
       Desarrollos en Baja California
      </LinkButton>

          {/* <Select
            value={state ?? undefined}
            onValueChange={(value) => {
              setState(value);
            }}
          >
            <SelectTrigger aria-label={t("selectState")}>
              <SelectValue placeholder={t("selectState")} />
            </SelectTrigger>
            <SelectContent>
              {developments?.map(({ name, id }) => (
                <SelectItem key={id} value={name}>
                  <p className="font-roboto">{name}</p>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={zone ?? undefined}
            onValueChange={(value) => {
              setZone(value);
            }}
            disabled={!state}
          >
            <SelectTrigger aria-label={t("selectZone")}>
              <SelectValue placeholder={t("selectZone")} />
            </SelectTrigger>
            <SelectContent>
              {availableZones.map(({ name, id }: any) => (
                <SelectItem key={id} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={price?.toString()}
            onValueChange={(value) => {
              const priceIndex = Number(value);

              if (value === undefined) {
                setPrice(undefined);
              } else {
                setPrice(priceIndex);
              }
            }}
          >
            <SelectTrigger className="hidden" aria-label={t("selectPrice")}>
              <SelectValue placeholder={t("selectPrice")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="-1" value="-1">
                {t("allPrices")}
              </SelectItem>
              {sortPrices.map((zone, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(zone.min)}{" "}
                  -{" "}
                  {zone.max
                    ? new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(zone.max)
                    : "Más"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link
              className={
                !state
                  ? "pointer-events-none opacity-50 font-bold font-roboto"
                  : "font-bold font-roboto"
              }
              href={`/estados/${toUrlCase(state ?? "")}?zona=${toUrlCase(
                zone ?? "all"
              )}&price=${price ?? "-1"}`}
            >
              {t("search")}
            </Link>
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
