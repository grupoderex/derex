import { useTranslation } from "react-i18next";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function PresaleBadge() {
  const { t } = useTranslation("translations");

  return (
    <div className="bg-black rounded h-fit">
      <HoverBorderGradient
        containerClassName="rounded-sm border-1 border-transparent w-full"
        className="rounded flex flex-row items-center p-0"
      >
        <svg
          width="40"
          height="26"
          viewBox="0 0 40 26"
          className="self-end"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_216_43"
            style={{
              maskType: "alpha",
            }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="40"
            height="26"
          >
            <rect width="40" height="26" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_216_43)">
            <path d="M13 10H17L-7 63H-11L13 10Z" fill="white" />
            <path d="M28 0H32L8 53H4L28 0Z" fill="#CD1019" />
            <path d="M36 14H40L16 67H12L36 14Z" fill="white" />
          </g>
        </svg>

        <span className="text-white font-display text-lg py-1 px-5">
          {t("presaleSimple")}
        </span>
      </HoverBorderGradient>
    </div>
  );
}
