"use client";

import { useSearchParams } from "next/navigation";
import { BlogsByCategorySection } from "@/components/blog/BlogsByCategorySection";
import { useEffect } from "react";

export default function ClientCategoryPage() {
  const params = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "categories_post_blog",
        pagePath: window.location.href,
        category: params?.get("topic"),
      });
    }
  }, [params]);

  return (
    <div className="container py-16">
      <BlogsByCategorySection initialCategory={params?.get("topic")} />
    </div>
  );
}
