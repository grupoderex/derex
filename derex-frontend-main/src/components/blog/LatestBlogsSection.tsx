import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    NextButton,
    PreviousButton,
} from "@/components/ui/carousel";
import { getLatestBlogs } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export function LatestBlogsSection({ isHome }: { isHome?: boolean }) {
  const { t, i18n } = useTranslation("translations");
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: latestArticles } = useQuery({
    queryKey: ["latestArticles", i18n.language, isHome],
    queryFn: async () => await getLatestBlogs(i18n.language, isHome ? 20 : 10),
  });

  const orderedLatestArticles = useMemo(() => {
    const articles = latestArticles?.data ?? [];

    return [...articles].sort((a, b) => {
      const aHasFecha = !!a.fecha;
      const bHasFecha = !!b.fecha;

      if (aHasFecha !== bHasFecha) {
        return aHasFecha ? -1 : 1;
      }

      const aDate = new Date(
        a.fecha ?? a.publishedAt ?? a.updatedAt ?? a.createdAt
      ).getTime();
      const bDate = new Date(
        b.fecha ?? b.publishedAt ?? b.updatedAt ?? b.createdAt
      ).getTime();

      return bDate - aDate;
    });
  }, [latestArticles]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("scroll", () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div
          className={`flex flex-row justify-between ${
            isHome ? "md:justify-flex-end" : " md:justify-start"
          }`}
        >
          {!isHome && <h4>{t("latestNews")} </h4>}
          {!isHome && (
            <Button asChild variant="ghost">
              <Link href="/blog/categoria">{t("seeAll")}</Link>
            </Button>
          )}
        </div>

        {!isHome && (
          <div className="flex-row gap-2 md:flex hidden">
            <PreviousButton
              onClick={() => {
                emblaApi?.scrollPrev();
              }}
              disabled={currentIndex === 0}
            />
            <NextButton
              onClick={() => {
                emblaApi?.scrollNext();
              }}
              disabled={currentIndex >= orderedLatestArticles.length - 1}
            />
          </div>
        )}
      </div>
      <Carousel
        className="hidden md:block"
        setApi={setEmblaApi}
        opts={{
          dragFree: true,
        }}
      >
        {isHome ? (
          <CarouselContent className="px-2 flex flex-row justify-center">
            {orderedLatestArticles
              ?.map((article) => (
                <CarouselItem
                  key={article.slug}
                  className="basis-auto max-w-full min-w-0 pl-5 pb-8 pt-1"
                >
                  <BlogCard article={article} className="w-96" />
                </CarouselItem>
              ))
              .slice(0, 3)}
          </CarouselContent>
        ) : (
          <CarouselContent className="px-2">
            {orderedLatestArticles?.map((article) => (
              <CarouselItem
                key={article.slug}
                className="basis-auto max-w-full min-w-0 pl-5 pb-8 pt-1"
              >
                <BlogCard article={article} className="w-96" />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Carousel>

      <div className="md:hidden flex flex-col gap-4">
        {isHome
          ? orderedLatestArticles
              ?.map((article) => (
                <BlogCard article={article} key={article.slug} />
              ))
              .slice(0, 3)
          : orderedLatestArticles?.map((article) => (
              <BlogCard article={article} key={article.slug} />
            ))}
      </div>

      {isHome && (
        <div className="w-max mx-auto">
          <Button asChild variant="ghost">
            <Link href="/blog/categoria">{t("seeAll")}</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
