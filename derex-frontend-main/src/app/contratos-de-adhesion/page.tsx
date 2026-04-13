import { getContratosAdhesion, getTitlesBySection } from "@/utils/api";
import ContractPage from "@/views/ContractPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getContratosAdhesion();
  const getHomeTitles = await getTitlesBySection("home");
  return <ContractPage data={data} homeTitles={getHomeTitles} />;
}
