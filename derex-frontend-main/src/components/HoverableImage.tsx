import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { ArrowsPointingOut } from "./icons/ArrowsPointingOut";
import { EyeSolidIcon } from "./icons/EyeSolidIcon";

interface ImageWithModalProps {
  src: string;
  alt: string;
  className?: string;
  isHoverable?: boolean;
  enableZoomButton?: boolean;
  colSpan?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
}

function HoverableImageBase({
  src,
  alt,
  className = "",
  isHoverable = true,
  onClick,
  enableZoomButton = false,
  colSpan = "",
  priority = false,
  sizes = "(max-width: 768px) 348px, 320px",
  unoptimized = false,
}: ImageWithModalProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const fallbackSrc = "/images/default-grid.webp";

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  if (!currentSrc || currentSrc.trim() === "") {
    return (
      <div
        className={`group relative select-none overflow-hidden bg-gray-200 flex items-center justify-center h-full w-full ${colSpan} ${className}`}
      >
        <span className="text-gray-400">Sin imagen</span>
      </div>
    );
  }

  return (
    <div
      className={`group relative select-none overflow-hidden  ${
        isHoverable ? "cursor-pointer" : ""
      } max-h-[550px] ${colSpan} ${className}`}
      onClick={isHoverable ? onClick : undefined}
    >
      <Image
        src={currentSrc}
        alt={alt || "Imagen del proyecto"}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover transform-gpu [backface-visibility:hidden] [will-change:transform] transition-transform duration-500 group-hover:scale-105`}
        quality={80}
        unoptimized={unoptimized}
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          }
        }}
      />

      {isHoverable && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
          <EyeSolidIcon />
        </div>
      )}
      {enableZoomButton && (
        <div className="absolute inset-0 z-10 flex items-start justify-end p-4 text-white group-hover:flex">
          <ArrowsPointingOut />
        </div>
      )}
    </div>
  );
}

export const HoverableImage = memo(HoverableImageBase);
