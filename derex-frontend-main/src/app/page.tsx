import {
  getInitialDataDesarrollos,
  getKnowJaver,
  getTitlesBySection,
  getWebsiteMedia,
} from "@/utils/api";
import Home from "../views/Home";
import { HOME_META } from "@/utils/metaTags";
import { cookies } from "next/headers";

export const metadata = HOME_META;

export default async function Page() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("i18next")?.value || "es"; // Detectar idioma
  const [websiteMedia, developments, knowJaver, homeTitles] = await Promise.all(
    [
      getWebsiteMedia(),
      getInitialDataDesarrollos(),
      getKnowJaver(),
      getTitlesBySection("home"),
    ]
  );
  return (
    <Home
      lang={lang}
      websiteMedia={websiteMedia}
      developments={developments}
      knowJaver={knowJaver}
      homeTitles={homeTitles}
    />
  );
}
