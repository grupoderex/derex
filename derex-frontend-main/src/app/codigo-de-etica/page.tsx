import { getTitlesBySection } from "@/utils/api";
import EthicCodePage from "@/views/EticCodePage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const homeTitles = await getTitlesBySection("home");
  return <EthicCodePage homeTitles={homeTitles} />;
}
