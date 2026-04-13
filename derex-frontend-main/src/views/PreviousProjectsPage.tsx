"use client";

import { Gallery, type ImageObject } from "@/components/ui/Gallery";
import { type Project } from "@/models/project";
import { getResourceUrl } from "@/utils/image.utils";
import Image from "next/image";

interface PreviousProjectsPageProps {
  title?: string;
  projects: Project[];
  projectImagesById?: Record<string, ImageObject[]>;
}

const defaultImage = "/images/default-grid.webp";
const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

function normalizeAmenityImageUrl(url?: string): string | undefined {
  if (!url) return undefined;

  const normalized = getResourceUrl(url);
  if (normalized) return normalized;

  if (ABSOLUTE_URL_REGEX.test(url)) return url;

  const publicBackendUrl = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL;
  if (!publicBackendUrl || !url.startsWith("/")) return undefined;

  return publicBackendUrl.endsWith("/")
    ? `${publicBackendUrl.slice(0, -1)}${url}`
    : `${publicBackendUrl}${url}`;
}

export default function PreviousProjectsPage({
  title = "Proyectos Anteriores",
  projects,
  projectImagesById = {},
}: PreviousProjectsPageProps) {
  return (
    <section className="container py-10 max-2xl:max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold uppercase text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="font-roboto text-sm text-foreground/70">{projects.length} desarrollos</p>
      </div>

      {projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-neutral-50 p-12 text-center">
          <p className="font-display text-2xl font-bold">Sin proyectos anteriores para mostrar</p>
        </div>
      )}

      {projects.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const fallbackImageSrc =
              getResourceUrl(project.thumbnail) ||
              getResourceUrl(project.banner_url) ||
              defaultImage;

            const amenityImages = projectImagesById[String(project.id)] ?? [];
            const normalizedAmenityImages = amenityImages
              .map((image) => ({
                ...image,
                url: normalizeAmenityImageUrl(image.url),
              }))
              .filter((image): image is ImageObject => !!image.url);

            const singleAmenityImage = normalizedAmenityImages[0]?.url;
            const imageAlt =
              normalizedAmenityImages[0]?.alt ||
              project.thumbnail_alt_text ||
              project.name;

            return (
              <article
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  {normalizedAmenityImages.length > 1 ? (
                    <Gallery
                      type="carousel"
                      images={normalizedAmenityImages}
                      unoptimized
                      isHoverable={false}
                      autoWidth={false}
                      classNames={{
                        ROOT: "h-full w-full",
                        Image: "h-full min-h-[330px] w-full",
                        Carousel: {
                          Content: "mx-0 h-full min-h-[330px]",
                          Item: "p-0 h-full min-h-[330px]",
                          Previous: "left-1 rounded-[24px]",
                          Next: "right-1 rounded-[24px]",
                        },
                      }}
                    />
                  ) : (
                    <Image
                      src={singleAmenityImage || fallbackImageSrc}
                      alt={imageAlt}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  {project.ciudad && (
                    <p className="mb-1 font-roboto text-xs font-medium uppercase tracking-[0.08em] text-foreground/60">
                      {project.ciudad}
                    </p>
                  )}
                  <h2 className="font-display text-xl font-bold leading-tight text-foreground">
                    {project.name}
                  </h2>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}