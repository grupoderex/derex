import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { getBlogCategories, getBlogsByCategory } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface BlogsByTopicSectionProps {
  initialCategory?: string | null;
}

export function BlogsByCategorySection({
  initialCategory,
}: BlogsByTopicSectionProps) {
  const { t, i18n } = useTranslation("translations");
  const [category, setCategory] = useState<string | undefined>(
    initialCategory ?? undefined
  );
  const [pageSize, setPageSize] = useState(12);

  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  const { data: newsByCategory, isLoading: loadingNewsByCategory } = useQuery({
    queryKey: ["newsByCategory", i18n.language, pageSize, category],
    queryFn: async () =>
      await getBlogsByCategory(i18n.language, category, 1, pageSize),
  });

  const { data: categories } = useQuery({
    queryKey: ["category", i18n.language],
    queryFn: () => getBlogCategories(i18n.language),
  });

  useEffect(() => {
    if (!category && categories?.data?.length) {
      setCategory(categories.data[0].name);
    }
  }, [categories, category]);

  useEffect(() => {
    setPageSize(12);
    if (categories?.data && categories.data.length > 0) {
      if (!category || !categories.data.some((tag) => tag.name === category)) {
        setCategory(categories.data[0].name);
      }
    }
  }, [i18n.language, categories]);

  return (
    <section className="flex flex-col gap-4">
      <h4>{t("newsByTopic")}</h4>
      <div>
        <Carousel
          opts={{
            watchDrag(api) {
              setCanScrollStart(api.canScrollPrev());
              setCanScrollEnd(api.canScrollNext());

              return true;
            },
            watchResize(api) {
              setCanScrollStart(api.canScrollPrev());
              setCanScrollEnd(api.canScrollNext());

              return true;
            },
            watchSlides(api) {
              setCanScrollStart(api.canScrollPrev());
              setCanScrollEnd(api.canScrollNext());

              return true;
            },
          }}
        >
          <CarouselContent className="px-4 gap-2">
            {categories?.data?.map((tag) => (
              <Button
                key={tag.id}
                className={`bg-neutral-300/20 text-neutral-700 px-4 py-3 ${
                  category === tag.name
                    ? "bg-primary/20 text-primary border-b-2 border-primary"
                    : ""
                }`}
                onClick={() => {
                  setCategory(tag.name);
                }}
                variant="ghost"
              >
                {tag.name}
              </Button>
            ))}
          </CarouselContent>
          {canScrollStart && <CarouselPrevious />}
          {canScrollEnd && <CarouselNext />}
        </Carousel>
      </div>
      <div className="h-px bg-gray-200 my-4" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {newsByCategory?.data?.map((article) => (
          <BlogCard article={article} key={article.slug} />
        ))}
      </div>
      <Button
        variant="outline"
        className={`md:self-start mt-8 ${
          (newsByCategory?.meta?.pagination?.pageCount ?? 0) <= 1
            ? "hidden"
            : ""
        }`}
        isLoading={loadingNewsByCategory}
        onClick={() => {
          setPageSize((prev) => prev + 12);
        }}
      >
        {t("seeMore")}
      </Button>
    </section>
  );
}
