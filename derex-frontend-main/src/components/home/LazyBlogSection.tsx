"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { LatestBlogsSection } from "@/components/blog/LatestBlogsSection";
import { useTranslation } from "react-i18next";

interface LazyBlogSectionProps {
  homeTitles?: any;
}

export function LazyBlogSection({ homeTitles }: LazyBlogSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { i18n } = useTranslation();

  return (
    <section ref={ref} className="container py-10">
      {isIntersecting ? (
        <>
          <h4
            className={`font-extrabold text-center text-4xl ${homeTitles?.home_blogJaver?.className} `}
          >
            {i18n.language === "en"
              ? homeTitles?.home_blogJaver?.value_en
              : homeTitles?.home_blogJaver?.value}
          </h4>
          <LatestBlogsSection isHome={true} />
        </>
      ) : (
        <div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg" />
      )}
    </section>
  );
}
