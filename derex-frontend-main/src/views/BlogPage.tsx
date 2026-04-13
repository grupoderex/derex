"use client";

import "@/i18n";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { BlogTrendingHero } from "@/components/blog/BlogTrendingHero";
import { LatestBlogsSection } from "@/components/blog/LatestBlogsSection";
import { BlogsByCategorySection } from "@/components/blog/BlogsByCategorySection";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { t } = useTranslation("translations");
  const navigate = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "view_blog",
        pagePath: window.location.href,
      });
    }
  }, []);

  return (
    <div>
      <div className="container flex flex-col gap-8 pb-16">
        <Input
          placeholder={t("searchNews")}
          parentClassName="max-w-96 self-end w-full"
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate.push(`/blog/buscar?term=${e.currentTarget.value}`);
            }
          }}
        />
        <BlogTrendingHero />
      </div>
      <NewsletterSection />
      <div className="container flex flex-col gap-8 pb-16 mt-16">
        <LatestBlogsSection />
        <BlogsByCategorySection />
      </div>
    </div>
  );
}
