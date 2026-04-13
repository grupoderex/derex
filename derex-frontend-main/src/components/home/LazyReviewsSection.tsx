"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllClientExperiences } from "@/utils/api";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "@uidotdev/usehooks";

export function LazyReviewsSection() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { i18n } = useTranslation();
  const { width } = useWindowSize();

  const { data: homeReviews } = useQuery({
    queryKey: ["getClientExperiences"],
    queryFn: async () => await getAllClientExperiences(),
    enabled: isIntersecting, // Solo fetch cuando la sección es visible
  });

  return (
    <div ref={ref}>
      {isIntersecting ? (
        <Carousel
          className={`lg:px-[100px] ${
            homeReviews?.data && homeReviews.data.length > 2
              ? ""
              : "lg:mx-auto"
          }`}
          opts={{
            dragFree: true,
          }}
        >
          <CarouselContent
            style={{
              marginLeft:
                width && width > 1440 ? (width - 1400) / 2 + 24 : 16,
              marginRight:
                width && width > 1400 ? (width - 1400) / 2 + 24 : 16,
            }}
          >
            {homeReviews?.data?.map((review, index) => (
              <CarouselItem
                key={index}
                className="lg:basis-auto max-w-full min-w-0 pl-2 pb-2"
              >
                <Card
                  onClick={
                    review.url
                      ? () => {
                          const url: string | undefined = review.url;
                          if (url) window.open(url, "_blank");
                        }
                      : undefined
                  }
                  className={`lg:max-w-[394px] select-none hover:bg-primary hover:text-primary-foreground transition-colors duration-500 h-full ${
                    review.url ? "cursor-pointer" : ""
                  }`}
                >
                  <CardContent className="flex flex-col gap-4 pt-4 h-full">
                    <div className="grow font-roboto">
                      &quot;
                      {i18n.language === "en"
                        ? review.description_en
                        : review.description_es}
                      &quot;
                    </div>
                    <div className="flex flex-col gap-4 lg:flex-row justify-between lg:items-center">
                      <div className="font-roboto">
                        - {review.project_name}
                      </div>
                      <Image
                        src={review.project_logo}
                        alt={review.project_name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-lg object-contain border bg-white p-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      ) : (
        // Placeholder para mantener layout
        <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
      )}
    </div>
  );
}
