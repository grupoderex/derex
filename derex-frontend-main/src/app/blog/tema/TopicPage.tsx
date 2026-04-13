"use client";
import { useSearchParams } from "next/navigation";
import { BlogsByTopicSection } from "@/components/blog/BlogsByTopicSection";
import { useEffect } from "react";

export default function TopicPage() {
  const params = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "tags_post_blog",
        pagePath: window.location.href,
        category: params?.get("topic"),
      });
    }
  }, [params]);

  return (
    <div className="container py-16">
      <BlogsByTopicSection initialTopic={params?.get("topic")} />
    </div>
  );
}
