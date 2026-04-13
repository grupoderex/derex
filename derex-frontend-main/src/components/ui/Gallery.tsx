import { useGalleryGrid } from "@/hooks/useGalleryGrid";
import { getResourceUrl } from "@/utils/image.utils";
import { useCallback, useMemo, useState } from "react";
import { HoverableImage } from "../HoverableImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import dynamic from "next/dynamic";
import { Thumbnails } from "yet-another-react-lightbox/plugins";
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

export interface ImageObject {
  url: string;
  alt: string | undefined;
}

interface GalleryProps {
  images?: Array<string | ImageObject>;
  type?: "grid" | "carousel";
  autoWidth?: boolean;
  unoptimized?: boolean;
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
  priority?: boolean;
}

export function Gallery({
  images,
  onClick,
  type = "grid",
  classNames,
  isHoverable = true,
  autoWidth = true,
  unoptimized = false,
  priority = false,
}: GalleryProps) {
  const [amenitiesLightboxController, setAmenitiesLightboxController] =
    useState({
      toggler: false,
      slide: 0,
    });

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

  const { gridClasses, getImageColSpan } = useGalleryGrid({
    imageCount: images?.length || 0,
  });

  return (
    <>
      {type === "grid" && (
        <section
          className={`grid gap-1 md:gap-4 ${gridClasses} mt-16 ${classNames?.ROOT}`}
        >
          {images?.map((image, index) => (
            <HoverableImage
              key={index}
              isHoverable={isHoverable}
              unoptimized={unoptimized}
              priority={priority && index === 0}
              src={getResourceUrl(
                typeof image === "string" ? image : image.url
              )!}
              alt={
                typeof image === "string"
                  ? "Imagen del proyecto"
                  : image.alt ?? "Imagen del proyecto"
              }
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                if (onClick) {
                  onClick(index, e);
                } else {
                  openImageOnIndex(index);
                }
              }}
              colSpan={getImageColSpan(index)}
              className={`w-full h-[250px] md:h-[400px] ${classNames?.Image}`}
            />
          ))}
        </section>
      )}
      {type === "carousel" && (
        <Carousel
          className={classNames?.ROOT}
          opts={{
            dragFree: true,
          }}
        >
          <CarouselContent className={`mx-6 ${classNames?.Carousel?.Content}`}>
            {images?.map((image, index) => (
              <CarouselItem
                key={index}
                className={`${autoWidth ? "basis-auto" : ""
                  } max-w-full min-w-0 pl-2 ${classNames?.Carousel?.Item}`}
              >
                <HoverableImage
                  priority={priority && index === 0}
                  unoptimized={unoptimized}
                  onClick={(e) => {
                    if (onClick) {
                      onClick(index, e);
                    } else {
                      openImageOnIndex(index);
                    }
                  }}
                  isHoverable={isHoverable}
                  className={`w-full ${classNames?.Image} lg:rounded-s-2xl`}
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
          <CarouselNext className={classNames?.Carousel?.Next} />
          <CarouselPrevious className={classNames?.Carousel?.Previous} />
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
