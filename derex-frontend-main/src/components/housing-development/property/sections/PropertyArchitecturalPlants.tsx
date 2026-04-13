import { HoverableImage } from "@/components/HoverableImage";
import { Button } from "@/components/ui/button";
import { type Property } from "@/models/property";
import { getResourceUrl } from "@/utils/image.utils";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Lightbox from "yet-another-react-lightbox";
import { Zoom } from "yet-another-react-lightbox/plugins";
import { MetadataTitle } from "@/models/metadata";

interface PropertyArchitecturalPlantsProps {
  property?: Property;
  propertyTitles?: Record<string, MetadataTitle>;
}

export function PropertyArchitecturalPlants({
  property,
  propertyTitles,
}: PropertyArchitecturalPlantsProps) {
  const { i18n } = useTranslation("translations");
  const [selectedBlueprint, setSelectedBlueprint] = useState(0);
  const bluePrint = useMemo(
    () => property?.blueprints?.[selectedBlueprint],
    [property, selectedBlueprint]
  );

  const [amenitiesLightboxController, setAmenitiesLightboxController] =
    useState({
      toggler: false,
      slide: 1,
    });

 

  if (!property?.blueprints || property.blueprints.length === 0) {
    return <></>;
  }

  return (
    <section
      className="container xl:max-w-5xl mx-auto mt-16"
      id="features-section"
    >
      <div className="flex flex-row justify-between">
        <h4
          className={`${propertyTitles?.prototypes_architecturalPlans?.className} font-display text-4xl`}
        >
          {i18n.language === "en"
            ? propertyTitles?.prototypes_architecturalPlans?.value_en
            : propertyTitles?.prototypes_architecturalPlans?.value}
        </h4>
      </div>
      <hr className="my-6 border-primary" />

      <div className="flex flex-col gap-2">
        <h6 className="mb-2 text-primary">
          {bluePrint?.title?.[i18n.language as "en" | "es"]}
        </h6>

        <div className="flex flex-row gap-2 items-center justify-start mb-8 flex-wrap">
          {property?.blueprints?.map((d, index) => (
            <Button
              key={d.id}
              className={`bg-neutral-300/20 text-neutral-700 px-4 py-3 ${
                selectedBlueprint === index
                  ? "bg-primary/20 text-primary border-b-2 border-primary"
                  : ""
              }`}
              onClick={() => {
                setSelectedBlueprint(index);
              }}
              variant="ghost"
            >
              {d.title?.[i18n.language as "en" | "es"]}
            </Button>
          ))}
        </div>


        {bluePrint?.image_url && (
          <HoverableImage
            src={bluePrint.image_url}
            alt={bluePrint?.image_alt_text ?? "Imagen del plano arquitectónico"}
            className="aspect-video object-cover w-full hover:opacity-75 transition-opacity cursor-pointer"
            onClick={() => {
              setAmenitiesLightboxController({
                toggler: !amenitiesLightboxController.toggler,
                slide: 0,
              });
            }}
            enableZoomButton
          />
        )}
        <Lightbox
          open={amenitiesLightboxController.toggler}
          close={() => {
            setAmenitiesLightboxController({ toggler: false, slide: 0 });
          }}
          slides={
            bluePrint?.image_url && getResourceUrl(bluePrint.image_url)
              ? [
                  {
                    src: getResourceUrl(bluePrint.image_url)!,
                    alt: bluePrint?.image_alt_text ?? "Imagen del plano arquitectónico",
                  },
                ]
              : []
          }
          zoom={{
            scrollToZoom: true,
          }}
          plugins={[Zoom]}
          styles={{
            navigationNext: {
              display: "none",
            },
            navigationPrev: {
              display: "none",
            },
          }}
        />
      </div>
    </section>
  );
}
