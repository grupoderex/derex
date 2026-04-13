"use client";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBlogBySearch } from "@/utils/api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchPage() {
  const params = useSearchParams();
  const term = params?.get("term");
  const { t, i18n } = useTranslation("translations");
  const [pageSize, setPageSize] = useState(12);
  const navigate = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "search_post_blog",
        pagePath: window.location.href,
        category: term,
      });
    }
  }, [term]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["searchResults", i18n.language, term],
    queryFn: async () =>
      await getBlogBySearch(term ?? "", 1, pageSize, i18n.language),
    enabled: !!term,
  });

  return (
    <section className="container py-8 flex flex-col gap-8">
      <Input
        className="self-start max-w-96"
        placeholder={t("searchNews")}
        defaultValue={term ?? ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate.push(`/blog/buscar?term=${e.currentTarget.value}`);
          }
        }}
      />
      <h4>
        {(searchResults?.meta?.pagination?.total ?? 0) > 0
          ? t("searchResultsFor", {
              topic: term,
              count: searchResults?.meta.pagination.total,
            })
          : t("noNewsFound", {
              topic: term,
            })}
      </h4>
      <div className="h-px bg-gray-200 my-4" />
      {(searchResults?.meta?.pagination?.total ?? 0) === 0 && (
        <div
          className="text-foreground-soft py-8"
          style={{
            backgroundImage: "url('/images/no-search.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <h5>{t("weRecommend")}</h5>
          <p className="whitespace-pre mt-6">
            {t("tryAnotherSearchRecommendations")}
          </p>
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {searchResults?.data?.map((article) => (
          <BlogCard article={article} key={article.slug} />
        ))}
      </div>
      <Button
        variant="outline"
        className={`md:self-start mt-8 ${
          (searchResults?.meta?.pagination?.pageCount ?? 0) <= 1 ? "hidden" : ""
        }`}
        isLoading={isLoading}
        onClick={() => {
          setPageSize((prev) => prev + 12);
        }}
      >
        {t("seeMore")}
      </Button>
    </section>
  );
}
