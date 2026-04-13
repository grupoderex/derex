import { getDecalogues, getTitlesBySection } from "@/utils/api";
import EticsPage from "@/views/Etics";

export default async function Page() {
  const homeTitles = await getTitlesBySection("home");
  const { data } = await getDecalogues("notice").catch(() => ({
    data: [],
  }));

  return <EticsPage homeTitles={homeTitles} notices={data} />;
}
