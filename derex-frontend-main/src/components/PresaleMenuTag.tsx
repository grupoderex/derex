import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

interface PresaleMenuTagProps {
  isExpanded?: boolean;
}

export function PresaleMenuTag({ isExpanded = false }: PresaleMenuTagProps) {
  const { t } = useTranslation("translations");

  return (
    <div className="flex items-center bg-black text-white w-fit rounded-full h-5 overflow-hidden">
      <Icon
        icon="heroicons-solid:tag"
        className="inline-block bg-primary text-primary-foreground p-1 rounded-full h-5 w-5"
      />
      <span
        className={`transition-all w-[78px] lg:w-0 group-hover/presale:w-[78px] hover:w-[78px] !no-underline duration-500`}
      >
        <span className="px-2 text-sm font-display">{t("presaleSimple")}</span>
      </span>
    </div>
  );
}
