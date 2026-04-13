"use client";
import "@/i18n";
import { Interweave } from "interweave";
import { DecalogueById } from "@/models/decalogue";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

export default function EticPage({ data }: { data: DecalogueById }) {
  const { i18n } = useTranslation("translations");

  return (
    <div className="m-10 md:m-40">
      <h3 className="text-center text-3xl lg:text-5xl font-extrabold">
        {i18n.language === "en" ? data.title_en : data.title_es}
      </h3>
      <div className="mt-16">
        <div className="text-end mb-4">
          Última actualización:{" "}
          {data.content_date && dayjs(data.content_date).format("DD/MM/YYYY")}
        </div>
        <Interweave
          className="whitespace-pre-wrap [&>ul>li]:list-disc [&>*>li]:ml-4 [&>ol>li]:list-decimal [&>div>img]:inline-block [&>blockquote]:border-l-4 [&>blockquote]:pl-4"
          content={data.content ?? ""}
        />
      </div>
    </div>
  );
}
