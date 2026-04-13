import { Suspense } from "react";
import AuthorPage from "./AuthorPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthorPage />
    </Suspense>
  );
}
