import NotFound from "@/app/not-found";
import { getFileByName } from "@/utils/api";

export default async function Page({
  params,
}: {
  params: Promise<{ fileName: string }>;
}) {
  const { fileName } = await params;

  let url = null;

  try {
    const response = await getFileByName(fileName ?? "");
    url = response.document_url;

    return (
      <iframe
        src={url}
        title="File Preview"
        style={{ width: "100%", height: "100vh", border: "none" }}
        allow="autoplay; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer"
      ></iframe>
    );
  } catch (e: any) {
    return <NotFound />;
  }
}
