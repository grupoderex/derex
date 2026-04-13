"use client";

import Link from "next/link";
import { toUrlCase } from "@/utils/common.utils";
import { DevelopmentOrientationIcon } from "./icons/DevelopmentOrientationIcon";
import { type Proyecto } from "@/models/location_hierarchy";
import { PromotionTag } from "@/components/shared/PromotionTag";
import { PresaleMenuTag } from "../components/PresaleMenuTag";
import { useEffect, useState } from "react";
import { getPromotionByProjectId } from "@/utils/api";

interface DesktopMenuLinkProps {
  project: Proyecto;
  setIsMenuOpen: (open: boolean) => void;
}

export function DesktopMenuLink({
  project,
  setIsMenuOpen,
}: DesktopMenuLinkProps) {
  const [promotionData, setPromotion] = useState<any>(null);

  useEffect(() => {
    if (!project) return;
    async function getPromotionsTag() {
      getPromotionByProjectId(project.id)
        .then((response) => {
          if (response) {
            setPromotion(response);
          }
        })
        .catch();
    }
    getPromotionsTag();
  }, []);

  return (
    <Link
      href={`/desarrollos/${toUrlCase(project.short_name)}`}
      key={project.id}
      onClick={() => {
        setIsMenuOpen(false);
      }}
      className={`transition-all px-4 py-2 cursor-pointer group/presale  flex flex-row items-center`}
    >
      <div className="flex flex-col gap-2">
        <div>
          <DevelopmentOrientationIcon
            orientation={project.type_orientation}
            className="inline-block hover:text-accent group-hover/presale:text-accent mr-2"
            size={24}
          />
          <span className="hover:underline group-hover/presale:underline text-foreground-soft hover:text-accent group-hover:text-accent font-bold font-display">
            {project.name}
          </span>
          <div className="inline-block ml-2 align-top">
            {!!project.is_presale && <PresaleMenuTag />}
          </div>
        </div>

        <div className="align-top">
          {promotionData?.is_active && <PromotionTag projectCard={false} />}
        </div>
      </div>
    </Link>
  );
}
