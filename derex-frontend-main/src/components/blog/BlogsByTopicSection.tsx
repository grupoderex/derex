import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { getBlogsByTopic, getBlogTopics } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface BlogsByTopicSectionProps {
  initialTopic?: string | null;
}

export function BlogsByTopicSection({
  initialTopic,
}: BlogsByTopicSectionProps) {
  const { t, i18n } = useTranslation("translations");
  const [topic, setTopic] = useState<string | undefined>(
    initialTopic ?? undefined
  );
  const [pageSize, setPageSize] = useState(12);

  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  const { data: newsByTopic, isLoading: loadingNewsByTopic } = useQuery({
    queryKey: ["newsByTopic", i18n.language, topic, pageSize],
    queryFn: () => getBlogsByTopic(i18n.language, topic, 1, pageSize),
  });

  const { data: tags } = useQuery({
    queryKey: ["tags", i18n.language],
    queryFn: () => getBlogTopics(i18n.language),
  });

  useEffect(() => {
    if (!topic && tags?.data && tags.data.length > 0) {
      setTopic(tags.data[0].name);
    }
  }, [tags, topic]);

  useEffect(() => {
    setPageSize(12);
    if (tags?.data && tags.data.length > 0) {
      if (!topic || !tags.data.some((tag) => tag.name === topic)) {
        setTopic(tags.data[0].name);
      }
    }
  }, [i18n.language, tags]);

  return (
    <section className="flex flex-col gap-4">
      <h4>{t("newsByTag")}</h4>
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
            {tags?.data?.map((tag: any) => (
              <Button
                key={tag.id}
                className={`bg-neutral-300/20 text-neutral-700 px-4 py-3 ${
                  topic === tag.name
                    ? "bg-primary/20 text-primary border-b-2 border-primary"
                    : ""
                }`}
                onClick={() => {
                  setTopic(tag.name);
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
        {newsByTopic?.data?.map((article) => (
          <BlogCard article={article} key={article.slug} />
        ))}
      </div>
      <Button
        variant="outline"
        className={`md:self-start mt-8 ${
          (newsByTopic?.meta?.pagination?.pageCount ?? 0) <= 1 ? "hidden" : ""
        }`}
        isLoading={loadingNewsByTopic}
        onClick={() => {
          setPageSize((prev) => prev + 12);
        }}
      >
        {t("seeMore")}
      </Button>
    </section>
  );
}
