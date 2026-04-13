import { Suspense } from "react";
import ClientCategoryPage from "./ClientCategoryPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientCategoryPage />
    </Suspense>
  );
}