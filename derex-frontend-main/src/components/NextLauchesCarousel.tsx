import { useEffect, useState } from "react";
import NextLaunchCard from "../components/NextLaunchCard";
import { getNextLaunches } from "@/utils/api";
import { type NextLaunch } from "@/models/nextLauches.inteface";
import { type MetadataTitle } from "@/models/metadata";
import { useTranslation } from "react-i18next";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useWindowSize } from "@uidotdev/usehooks";

export default function NextLaunchesCarousel({
  homeTitles,
  nearestState,
}: {
  homeTitles: Record<string, MetadataTitle> | undefined;
  nearestState: any;
}) {
  const { width } = useWindowSize();
  const [arrayNextDevelopments, setNextLaunches] = useState<NextLaunch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { i18n } = useTranslation("translations");

  useEffect(() => {
    setIsLoading(true);

    async function fetchNextLaunches() {
      try {
        const { projects } = await getNextLaunches();

        if (nearestState) {
          const sorted = projects.sort((a, b) => {
            if (
              a.state_id === nearestState.state.id &&
              b.state_id !== nearestState.state.id
            )
              return -1;
            if (
              a.state_id !== nearestState.state.id &&
              b.state_id === nearestState.state.id
            )
              return 1;
            return 0;
          });

          setNextLaunches(sorted);
          setIsLoading(false);
          return;
        }

        setNextLaunches(projects);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }

    fetchNextLaunches();
  }, []);

  const isSingleItem = arrayNextDevelopments.length === 1;
  const carouselMargin =
    width && width < 768
      ? 16
      : width && width > 1400
      ? (width - 1400) / 2 + 24
      : 24;

  return (
    <>
      {arrayNextDevelopments.length > 0 && (
        <section className="w-full mx-auto p-0 lg:px-8 bt-12 lg:pt-0 max-2xl:max-w-7xl flex flex-col">
          <div className="flex flex-col w-full items-center justify-center">
            <h3
              className={`font-bold text-center text-[36px] lg:text-4xl ${homeTitles?.home_nextDevelopmentsUp?.className}`}
            >
              {i18n.language === "en"
                ? homeTitles?.home_nextDevelopments?.value_en
                : homeTitles?.home_nextDevelopments?.value}
            </h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Carousel
              className={`${
                arrayNextDevelopments.length <= 2
                  ? "max-w-4xl mx-auto"
                  : "lg:px-[100px]"
              }`}
              opts={{
                dragFree: !isSingleItem,
                align: "start",
              }}
            >
              <CarouselContent
                className={`py-4 ${
                  arrayNextDevelopments.length <= 2 ? "justify-center" : ""
                }`}
                style={{
                  marginLeft:
                    arrayNextDevelopments.length > 2 ? carouselMargin : 0,
                  marginRight:
                    arrayNextDevelopments.length > 2 ? carouselMargin : 0,
                }}
              >
                {arrayNextDevelopments?.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className={`${
                      isSingleItem
                        ? "basis-full flex justify-center px-4 md:px-0"
                        : "basis-[90%] sm:basis-[85%] md:basis-auto"
                    } max-w-full min-w-0 pl-2 md:pl-4`}
                  >
                    <NextLaunchCard nextLaunch={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {arrayNextDevelopments.length > 1 && (
                <>
                  <CarouselNext className="lg:translate-x-12 xl:translate-x-16" />
                  <CarouselPrevious className="lg:-translate-x-12 xl:-translate-x-16" />
                </>
              )}
            </Carousel>
          )}
        </section>
      )}
    </>
  );
}
