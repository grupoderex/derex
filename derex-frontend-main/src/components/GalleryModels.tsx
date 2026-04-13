"use client";
import { getResourceUrl } from "@/utils/image.utils";
import { useWindowSize } from "@uidotdev/usehooks";
import { useCallback, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { Thumbnails } from "yet-another-react-lightbox/plugins";
import { HoverableImage } from "./HoverableImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export interface ImageObject {
  url: string;
  alt: string | undefined;
}

interface GalleryProps {
  images?: Array<string | ImageObject>;
  type?: "grid" | "carousel";
  autoWidth?: boolean;
  disableImageOptimization?: boolean;
  onClick?: (index: number, event: React.MouseEvent<HTMLElement>) => void;
  isHoverable?: boolean;
  classNames?: {
    ROOT?: string;
    Image?: string;
    Carousel?: {
      Content?: string;
      Item?: string;
      Next?: string;
      Previous?: string;
    };
  };
}

export function GalleryModels({
  images,
  onClick,
  type = "grid",
  classNames,
  isHoverable = true,
  autoWidth = true,
  disableImageOptimization = false,
}: GalleryProps) {
  const [amenitiesLightboxController, setAmenitiesLightboxController] =
    useState({
      toggler: false,
      slide: 0,
    });

  const { width } = useWindowSize();

  const openImageOnIndex = useCallback(
    (slide: number) => {
      setAmenitiesLightboxController({
        toggler: true,
        slide,
      });
    },
    []
  );

  const lightboxSlides = useMemo(
    () =>
      images?.map((image) => ({
        src: getResourceUrl(typeof image === "string" ? image : image.url)!,
        alt: typeof image === "string" ? undefined : image.alt,
      })) ?? [],
    [images]
  );

  const imageCount = images?.length || 0;
  const isSingleImage = imageCount === 1;
  const isTwoImages = imageCount === 2;
  const shouldDistributeEqually = imageCount <= 3;

  const getCarouselItemBasis = () => {
    const mobileBasis = "basis-full w-full";

    if (isSingleImage) return `${mobileBasis} md:basis-auto md:mx-auto`; //
    if (isTwoImages)
      return `${mobileBasis} md:basis-auto md:max-w-full md:gap-2 lg:basis-1/2`;
    if (autoWidth)
      return `${mobileBasis} md:basis-auto md:max-w-full md:gap-2 lg:basis-1/3`;
    return mobileBasis;
  };

  return (
    <>
      {type === "grid" && (
        <section
          className={`grid gap-1 md:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 mt-16 ${classNames?.ROOT}`}
        >
          {images?.map((image, index) => (
            <HoverableImage
              key={index}
              isHoverable={isHoverable}
              unoptimized={disableImageOptimization}
              src={getResourceUrl(
                typeof image === "string" ? image : image.url
              )!}
              alt={
                typeof image === "string"
                  ? "Imagen del proyecto"
                  : image.alt ?? "Imagen del proyecto"
              }
              onClick={(e) => {
                if (onClick) {
                  onClick(index, e);
                } else {
                  openImageOnIndex(index);
                }
              }}
              className={`object-cover aspect-square ${classNames?.Image}`}
            />
          ))}
        </section>
      )}
      {type === "carousel" && (
        <Carousel
          className={`max-w-7xl mx-auto ${classNames?.ROOT}`}
          opts={{
            dragFree: imageCount >= 3,
            watchDrag: true,
            align:
              width && width < 768
                ? "start"
                : shouldDistributeEqually
                  ? "center"
                  : "start",
            slidesToScroll: width && width < 768 ? 1 : "auto",
          }}
        >
          <CarouselContent
            className={`${classNames?.Carousel?.Content} md:gap-4`}
            style={{
              marginLeft:
                width && width < 768
                  ? 0
                  : shouldDistributeEqually
                    ? 0
                    : undefined,
              marginRight:
                width && width < 768
                  ? 0
                  : shouldDistributeEqually
                    ? 0
                    : undefined,
            }}
          >
            {images?.map((image, index) => (
              <CarouselItem
                key={index}
                className={`${getCarouselItemBasis()} min-w-0 ${width && width < 768
                    ? "pl-0 pr-0"
                    : shouldDistributeEqually
                      ? "pl-0"
                      : "pl-2"
                  } ${classNames?.Carousel?.Item}`}
              >
                <HoverableImage
                  onClick={(e) => {
                    if (onClick) {
                      onClick(index, e);
                    } else {
                      openImageOnIndex(index);
                    }
                  }}
                  isHoverable={isHoverable}
                  unoptimized={disableImageOptimization}
                  className={`object-cover aspect-square h-[500px] w-full ${classNames?.Image}`}
                  src={getResourceUrl(
                    typeof image === "string" ? image : image.url
                  )!}
                  alt={
                    typeof image === "string"
                      ? "Imagen del proyecto"
                      : image.alt ?? "Imagen del proyecto"
                  }
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {imageCount > 1 && (
            <>
              <CarouselNext className={classNames?.Carousel?.Next} />
              <CarouselPrevious className={classNames?.Carousel?.Previous} />
            </>
          )}
        </Carousel>
      )}
      <Lightbox
        index={amenitiesLightboxController.slide}
        open={amenitiesLightboxController.toggler}
        close={() => {
          setAmenitiesLightboxController((prev) => ({
            ...prev,
            toggler: false,
          }));
        }}
        slides={lightboxSlides}
        plugins={[Thumbnails]}
        thumbnails={{
          border: 0,
          imageFit: "cover",
          gap: 4,
          height: 128,
          width: 172,
        }}
      />
    </>
  );
}
