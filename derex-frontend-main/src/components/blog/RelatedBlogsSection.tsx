import { BlogCard } from "@/components/BlogCard";
import {
  type CarouselApi,
  PreviousButton,
  NextButton,
  CarouselContent,
  CarouselItem,
  Carousel,
} from "@/components/ui/carousel";
import { getBlogsByTopic } from "@/utils/api";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

interface RelatedBlogsSectionProps {
  articleId: number;
  topics: string[];
  isHome: boolean;
}

export function RelatedBlogsSection({
  topics,
  articleId,
  isHome,
}: RelatedBlogsSectionProps) {
  const { t, i18n } = useTranslation("translations");
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();

  const { data: latestArticles, isLoading } = useQuery({
    queryKey: ["relatedArticles", topics, i18n.language, articleId],
    queryFn: async () =>
      await getBlogsByTopic(i18n.language, topics, 1, 10, articleId),
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

  if (isLoading || orderedLatestArticles.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row md:justify-start justify-between">
          <h4>{t("relatedArticles")} </h4>
        </div>
        <div className="flex-row gap-2 md:flex hidden">
          <PreviousButton
            onClick={() => {
              emblaApi?.scrollPrev();
            }}
            disabled={emblaApi?.canScrollPrev() === false}
          />
          <NextButton
            onClick={() => {
              emblaApi?.scrollNext();
            }}
            disabled={emblaApi?.canScrollNext() === false}
          />
        </div>
      </div>
      <Carousel
        className="hidden md:block"
        setApi={setEmblaApi}
        opts={{
          dragFree: true,
        }}
      >
        <CarouselContent className="px-2">
          {orderedLatestArticles.map((article) => (
            <CarouselItem
              key={article.slug}
              className="basis-auto max-w-full min-w-0 pl-5 pb-4 pt-1"
            >
              <BlogCard article={article} className="w-96" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="md:hidden flex flex-col gap-4">
        {isHome
          ? orderedLatestArticles
              ?.map((article) => (
                <BlogCard article={article} key={article.slug} />
              ))
              .slice(0, 3)
          : orderedLatestArticles.map((article) => (
              <BlogCard article={article} key={article.slug} />
            ))}
      </div>
    </section>
  );
}
