import { HoverableImage } from "@/components/HoverableImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type Media } from "@/models/new_blog";
import { getBlogResourceUrl } from "@/utils/image.utils";
import { memo, useCallback, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { Thumbnails } from "yet-another-react-lightbox/plugins";

interface BlogCarouselProps {
  images: Media[];
}

function BlogCarouselBase({ images }: BlogCarouselProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const imageCount = images.length;
  const isSingle = imageCount === 1;
  const isTwo = imageCount === 2;

  const carouselOpts = useMemo(
    () => ({
      dragFree: imageCount >= 3,
      watchDrag: true,
      align: (isSingle || isTwo ? "center" : "start") as "center" | "start",
    }),
    [imageCount, isSingle, isTwo]
  );

  const lightboxSlides = useMemo(
    () =>
      images.map((img) => ({
        src: getBlogResourceUrl(img.url) ?? "/images/blog/img_blogPageHeader.png",
        alt: img.alternativeText ?? undefined,
      })),
    [images]
  );

  const itemBasis = isSingle
    ? "basis-full"
    : isTwo
    ? "basis-full md:basis-1/2"
    : "basis-full md:basis-1/3";

  return (
    <section className="w-full">
      <Carousel
        opts={carouselOpts}
      >
        <CarouselContent className="md:gap-4">
          {images.map((image, index) => {
            const src = getBlogResourceUrl(image.url) ?? "/images/blog/img_blogPageHeader.png";
            return (
              <CarouselItem
                key={`${image.id}-${index}`}
                className={`${itemBasis} min-w-0 pl-2`}
              >
                <HoverableImage
                  src={src}
                  alt={image.alternativeText ?? "Imagen de carrusel"}
                  className="h-[400px] w-full rounded-lg"
                  onClick={() => openLightbox(index)}
                  isHoverable
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {imageCount > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {lightboxOpen && (
        <Lightbox
          index={lightboxIndex}
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
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
      )}
    </section>
  );
}

export const BlogCarousel = memo(BlogCarouselBase);

