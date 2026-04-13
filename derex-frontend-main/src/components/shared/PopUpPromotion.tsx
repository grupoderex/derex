"use client";

import { useEffect, useState } from "react";
import { getPromotionByProjectId } from "@/utils/api";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import PromotionMobileIcon from "../icons/PromotionMobileIcon";
import { Icon } from "@iconify/react";
interface PopUpPromotionProps {
  idProject: number;
}

export function PopUpPromotion({ idProject }: PopUpPromotionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [promotionData, setPromotion] = useState<any>(null);
  const [closedState, setClosedState] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [showInitial, setShowInital] = useState(false);

  const { i18n, t } = useTranslation("translations");

  const description =
    i18n.language === "es"
      ? promotionData?.description_es ?? ""
      : promotionData?.description_en ?? "";

  const isLongText = description.length > 100;
  const displayedText = showFullText ? description : description.slice(0, 100);

  useEffect(() => {
    setTimeout(() => {
      setShowInital(true);
    }, 1000);
  }, [showInitial]);

  useEffect(() => {
    if (!idProject) return;
    async function getPromotionsTag() {
      getPromotionByProjectId(idProject)
        .then((response) => {
          if (response) {
            setPromotion(response);
          }
        })
        .catch();
    }
    getPromotionsTag();
  }, [idProject]);

  useEffect(() => {
    if (!closedState) {
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > 500) {
          setShowDetails(true);
        } else {
          setShowDetails(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [closedState]);

  function handlingClose() {
    setShowDetails(() => !showDetails);
    setClosedState(() => !closedState);
  }

  function handlingShowFullText() {
    setShowFullText(() => !showFullText);
  }

  return (
    <>
      {promotionData?.is_active && (
        <>
          <div
            className={`relative z-10 overflow-hidden hidden lg:block bg-transparent pt-[20px] pr-[20px]  ${
              showDetails
                ? "pop-up-promotion-width"
                : "pop-up-promotion-width-hide"
            }`}
          >
            <div
              className="absolute w-16 h-16 bottom-3 left-3 z-10 cursor-pointer"
              onClick={() => {
                handlingClose();
              }}
            >
              <Image
                width={64}
                height={64}
                src="/images/iconos/icon-popUp.svg"
                alt=""
              />
            </div>

            <div
              className={`absolute top-0 right-[9px] z-20 cursor-pointer rounded-full w-6 h-6 bg-black
                   ${
                     showDetails
                       ? `close-btn-animation`
                       : "close-btn-animation-down"
                   }`}
              onClick={() => {
                handlingClose();
              }}
            >
              <Icon icon="ion:md-close" width="24" className="text-white" />
            </div>

            <div
              className={`relative overflow-hidden 
                ${
                  showFullText ? "pop-up-full-cont" : "pop-up-small-cont"
                } min-h-[128px] bg-transparent flex flex-row justify-end bottom-[13px] ${
                showDetails ? `animation-slide-up` : "animation-slide-down"
              } transition-all duration-500 ease-in-out`}
            >
              <div
                className={` relative ${
                  showFullText
                    ? "pop-up-full-containter"
                    : "pop-up-small-containter"
                } bg-white flex flex-col gap-2 border border-neutral-300 `}
              >
                <div className="relative min-h-[184px] w-full">
                  <Image
                    src={promotionData?.promo_image || "/placeholder.png"}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>

                <div className="p-2">
                  <p className="text-[12px] text-center break-words transition-all duration-500 ease-in-out font-roboto">
                    {displayedText}
                    {isLongText && !showFullText && "..."}
                  </p>

                  {isLongText && (
                    <div className="w-max mx-auto">
                      <button
                        onClick={() => {
                          handlingShowFullText();
                        }}
                        className="text-primary mt-1 text-[15px] text-center break-words cursor-pointer "
                      >
                        {showFullText ? "Ver menos" : "Ver más"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`relative overflow-hidden max-h-[48px] mb-[7px] ${
                showFullText ? "pop-up-full-cont" : "pop-up-small-cont"
              } h-[60px]  bg-transparent flex flex-row justify-end bottom-[13px] ${
                showDetails ? "animation-side-show" : "animation-side-hide"
              }`}
            >
              <div
                className={`${
                  showFullText ? "pop-up-full-title" : "pop-up-small-title"
                }  bg-black flex flex-row items-center justify-center transition-all duration-500 ease-in-out h-full`}
              >
                <p className="text-white font-display text-center py-1">
                  {i18n.language === "es"
                    ? promotionData?.title_es
                    : promotionData?.title_en}
                </p>
              </div>
            </div>
          </div>

          <div className="w-screen  block lg:hidden">
            <div
              className="cursor-pointer w-full bg-black flex flex-row items-center justify-center px-2 min-h-12"
              onClick={() => {
                handlingClose();
              }}
            >
              <div className="flex flex-row items-center gap-3 h-10">
                <PromotionMobileIcon />
                <p className="text-white font-display text-center py-1">
                  {i18n.language === "es"
                    ? promotionData?.title_es
                    : promotionData?.title_en}
                </p>

                <Icon
                  icon="ion:chevron-down"
                  // Iconify hereda las clases de Tailwind perfectamente
                  className={`min-h-5 min-w-5 text-white transition-transform duration-300 ${
                    showDetails ? "rotate-180" : ""
                  }`}
                  // Si necesitas forzar tamaño por atributo además de la clase: width="20"
                />
              </div>
            </div>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showDetails ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="w-full bg-white h-full flex flex-col border border-gray-300 shadow-xl">
                <div className="relative min-h-[223px] max-h-[223px] h-[223px] w-full max-w-[350px] mx-auto">
                  <Image
                    src={promotionData?.promo_image || "/placeholder.png"}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 350px"
                    priority={false}
                  />
                </div>

                <div className="w-full min-h-12 mt-2 p-2">
                  <p className="text-xs text-center break-words transition-all duration-300 ease-in-out">
                    {displayedText}
                    {isLongText && !showFullText && "..."}
                  </p>

                  {isLongText && (
                    <div className="w-max mx-auto">
                      <button
                        onClick={() => {
                          setShowFullText(!showFullText);
                        }}
                        className="text-primary mt-1 text-[15px] mb-2 text-center break-words "
                      >
                        {showFullText ? t("showLess") : t("showMore")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
