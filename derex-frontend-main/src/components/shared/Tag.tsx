
import Image from "next/image";

export function Tag({
  configTag,
}: {
  configTag: { title: string; animation: boolean };
}) {
  return (
    <div className="w-[128px] h-6  bg-promo-gradient rounded-md p-2 flex flex-row items-center relative">
      <div className="flex flex-row gap-1 items-center">
        <Image
          src="/images/markPromotion.svg"
          alt="promotion"
          className="w-6 w-min-6"
          width={24}
          height={24}
        />
        <p className="text-white text-xs font-display">{configTag.title}</p>
      </div>
    </div>
  );
}
