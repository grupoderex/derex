import dynamic from "next/dynamic";
import animationData from "../../assets/animations/Javer_Promo_01.json";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export function PromotionTag({
  projectCard = false,
}: {
  projectCard?: boolean;
}) {
  const { t } = useTranslation("translations");

  return (
    <div
      className={`min-w-[113px] h-6 bg-promo-gradient rounded-md p-2 flex flex-row items-center relative w-max ${
        projectCard ? "h-[36px] w-max pr-9" : "pr-2"
      }`}
    >
      <div className="flex flex-row gap-1 items-center pr-5">
        <Image
          src="/images/markPromotion.png"
          alt=""
          width={24}
          height={24}
          className="w-6 min-w-6"
        />
        <p
          className={`font-display font-medium  text-white  ${
            projectCard ? "text-lg" : " text-sm"
          }`}
        >
          {t("promotions")}
        </p>
      </div>

      <Lottie
        className={`absolute  ${
          projectCard
            ? "-right-[40px] -bottom-[5px] w-[123px]"
            : "-bottom-[7px] -right-[33px] lg:-right-[27px] lg:-bottom-[4px] w-[92px]  lg:w-[73px]"
        }`}
        animationData={animationData}
        loop={true}
      />
    </div>
  );
}
