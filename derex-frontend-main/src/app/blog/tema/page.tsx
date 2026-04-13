import { Suspense } from "react";
import TopicPage from "./TopicPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopicPage />
    </Suspense>
  );
}