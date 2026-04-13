import { EMPTY_DECALOGUE } from "@/models/decalogue";
import { getDecalogueById } from "@/utils/api";
import EticPage from "@/views/Etic";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: any }) {
  const { name } = params;
  const id = Number(name);
  const { data } = await getDecalogueById(id).catch(() => ({
    data: EMPTY_DECALOGUE,
  }));

  return <EticPage data={data} />;
}
