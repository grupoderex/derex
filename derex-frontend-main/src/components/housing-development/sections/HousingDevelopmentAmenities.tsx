import { GridList } from "@/components/GridList";
import { getAmenitiesByProjectId, getTitlesBySection } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  GalleryModels,
  type ImageObject,
} from "../../../components/GalleryModels";

interface HousingDevelopmentAmenitiesProps {
  projectId?: number;
}

export function HousingDevelopmentAmenities({
  projectId,
}: HousingDevelopmentAmenitiesProps) {
  const { i18n } = useTranslation("translations");
  const disableImageOptimizationInLocal =
    process.env.NODE_ENV !== "production";

  const { data: amenitiesText } = useQuery({
    queryKey: ["getAmenitiesByProjectId", projectId, "text"],
    queryFn: async () => await getAmenitiesByProjectId(projectId ?? -1, "text"),
  });

  const { data: amenitiesImages } = useQuery({
    queryKey: ["getAmenitiesByProjectId", projectId, "image"],
    queryFn: async () =>
      await getAmenitiesByProjectId(projectId ?? -1, "image"),
  });

  const { data: projectTitles } = useQuery({
    queryKey: ["getProjectTitles", projectId],
    queryFn: async () => await getTitlesBySection(`project_${projectId ?? -1}`),
    enabled: !!projectId,
  });

  return (
    <>
      {amenitiesText?.amenities && amenitiesText.amenities.length > 0 && (
        <section className="container xl:max-w-5xl  mt-16">
          <h3
            className={`${projectTitles?.developments_amenities?.className} font-bold`}
          >
            {i18n.language === "en"
              ? projectTitles?.developments_amenities?.value_en
              : projectTitles?.developments_amenities?.value}
          </h3>
          <hr className="my-6 border-primary" />
          <GridList
            items={
              amenitiesText?.amenities.map((amenity) =>
                i18n.language === "es" ? amenity.name : amenity.name_eng
              ) ?? []
            }
          />
        </section>
      )}
      {amenitiesImages?.amenities && amenitiesImages.amenities.length > 0 && (
        <section className="mt-16">
          <GalleryModels
            images={amenitiesImages.amenities
              .map((amenity) => ({
                url: amenity.img_url,
                alt: amenity.img_alt_text,
              }))
              .filter((imgUrl): imgUrl is ImageObject => !!imgUrl.url)}
            type="carousel"
            disableImageOptimization={disableImageOptimizationInLocal}
            classNames={{}}
          />
        </section>
      )}
    </>
  );
}
