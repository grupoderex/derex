"use client";

import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { getBlogByAuthor } from "@/utils/api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function AuthorPage() {
  const params = useSearchParams();
  const firstName = params?.get("firstName");
  const lastName = params?.get("lastName");
  const { t, i18n } = useTranslation("translations");
  const [pageSize, setPageSize] = useState(12);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["searchResults", i18n.language, firstName, lastName],
    queryFn: async () =>
      await getBlogByAuthor(
        firstName ?? "",
        lastName ?? "",
        1,
        pageSize,
        i18n.language
      ),
    enabled: !!firstName && !!lastName,
  });

  return (
    <section className="container py-16 flex flex-col gap-4">
      <h4>
        {t("allNewsWrittenBy", {
          name: `${firstName} ${lastName}`,
        })}
      </h4>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
