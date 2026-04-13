import { type Project } from "@/models/project";
import { type Property } from "@/models/property";
import { getResourceUrl } from "@/utils/image.utils";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface AdditionalInfoSectionProps {
  info: Project["additional_info"] | Property["additional_info"];
}

export function AdditionalInfoSection({ info }: AdditionalInfoSectionProps) {
  const { i18n, t } = useTranslation("translations");

  if (!info?.description) {
    return null;
  }

  return (
    <section className="container xl:max-w-5xl mx-auto mt-16">
      <h4 className="font-bold">
        {info.title?.[i18n.language as "en" | "es"]}
      </h4>
      <hr className="my-6 border-primary" />

      <p className="mt-4 whitespace-pre-wrap">
        {info.description?.[i18n.language as "en" | "es"]}
      </p>
      {info.more_info_url && (
        <Button className="mt-4" asChild variant="ghost">
          <a
            href={info.more_info_url}
            target="_blank"
            rel="noreferrer"
            className="flex flex-row items-center"
          >
            <Icon icon="heroicons-solid:plus" width="24" className="mr-2" />
            {t("seeMore")}
          </a>
        </Button>
      )}
      {info.image_ulr && (
        <Image
          src={getResourceUrl(info.image_ulr)!}
          alt={info.image_alt_text ?? "additional info image"}
          width={800}
          height={600}
          quality={80}
          className="w-full rounded-md mt-4"
        />
      )}
    </section>
  );
}
