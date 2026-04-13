import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getFeaturedBlogs } from "@/utils/api";
import { getBlogResourceUrl } from "@/utils/image.utils";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
dayjs.extend(localizedFormat);

export function BlogTrendingHero() {
  const { t, i18n } = useTranslation("translations");
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { data: featuredArticles } = useQuery({
    queryKey: ["featuredArticles", i18n.language],
    queryFn: async () => await getFeaturedBlogs(i18n.language),
    refetchOnWindowFocus: false,
  });

  const orderedFeaturedArticles = useMemo(() => {
    const articles = featuredArticles?.data ?? [];

    return [...articles].sort((a, b) => {
      const aHasFecha = !!a.fecha;
      const bHasFecha = !!b.fecha;

      if (aHasFecha !== bHasFecha) {
        return aHasFecha ? -1 : 1;
      }

      const aDate = new Date(a.fecha ?? a.publishedAt ?? a.updatedAt ?? a.createdAt).getTime();
      const bDate = new Date(b.fecha ?? b.publishedAt ?? b.updatedAt ?? b.createdAt).getTime();

      return bDate - aDate;
    });
  }, [featuredArticles]);

  const currentFeaturedArticle = useMemo(
    () => orderedFeaturedArticles[currentIndex],
    [orderedFeaturedArticles, currentIndex]
  );

  const currentArticleHref = currentFeaturedArticle?.slug
    ? `/blog/${currentFeaturedArticle.slug}`
    : "/blog";

  useEffect(() => {
    if (emblaApi) {
      const snapIndex = emblaApi.selectedScrollSnap();
      if (currentIndex !== snapIndex) {
        emblaApi.scrollTo(currentIndex);
      }
    }
  }, [currentIndex, emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    let isCarouselPlaying = true;

    const interval = setInterval(() => {
      if (isCarouselPlaying) {
        emblaApi.scrollNext();
      }
    }, 5000);

    emblaApi.on("select", () => {
      const index = emblaApi.selectedScrollSnap();
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    });

    emblaApi.on("pointerDown", () => {
      isCarouselPlaying = false;
    });
    emblaApi.on("pointerUp", () => {
      isCarouselPlaying = true;
    });

    return () => {
      clearInterval(interval);
    };
  }, [emblaApi, currentIndex, featuredArticles]);

  return (
    <section className="flex flex-col md:flex-row gap-4 [&>*]:md:w-1/2 items-center">
      <div className="flex flex-col gap-4">
        <div className="border-primary border-solid text-primary border-[1px] w-fit rounded-md font-semibold px-2 py-1">
          {t("trending")}
        </div>
        <div className="text-neutral-400 font-display">
          {/* {dayjs(currentFeaturedArticle?.createdAt)
            .locale(i18n.language)
            .format("LL")}{" "}
          |{" "} */}
          {t("minutesOfReadingShort", {
            minutes: Math.ceil(
              (currentFeaturedArticle?.content
                .map((it) =>
                  it.__component === "blog.content" ? it.rich_text : ""
                )
                .join("\n")
                .split(" ").length ?? 0) / 180
            ),
          })}
        </div>
        <h2 className="text-4xl">
          <Link href={currentArticleHref} className="hover:underline">
            {currentFeaturedArticle?.title}
          </Link>
        </h2>
        <Button asChild className="self-start">
          <Link href={currentArticleHref}>
            {t("readMore")}
            <Icon icon="heroicons:arrow-right" width="20" className="ml-2" />
          </Link>
        </Button>
      </div>
      <div>
        <Carousel
          setApi={setEmblaApi}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {orderedFeaturedArticles.map((article) => (
              <CarouselItem key={article.slug}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="relative block w-full aspect-video"
                >
                  <Image
                    src={
                      getBlogResourceUrl(article.thumbnail?.url) ??
                      "/images/blog/img_blogPageHeader.png"
                    }
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div
          className={`flex flex-row gap-2 justify-center mt-4 ${
            orderedFeaturedArticles.length === 1 ? "hidden" : ""
          }`}
        >
          {orderedFeaturedArticles.map((_, index) => (
            <div
              key={index}
              className={`cursor-pointer h-4 transition-all rounded-full ${
                index === currentIndex
                  ? "w-12 bg-primary"
                  : "w-4 bg-neutral-300"
              }`}
              onClick={() => {
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
