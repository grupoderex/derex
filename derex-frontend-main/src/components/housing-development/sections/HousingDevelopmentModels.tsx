import { ModelCard } from "@/components/ModelCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type Project } from "@/models/project";
import { type PropertySearch } from "@/models/property_search";
import { toUrlCase } from "@/utils/common.utils";
import { useWindowSize } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";

interface HousingDevelopmentModelsProps {
  project?: Project;
  properties?: PropertySearch[];
  actions?: React.ReactNode;
  showHidden?: boolean;
}

export function HousingDevelopmentModels({
  project,
  properties,
  actions,
  showHidden,
}: HousingDevelopmentModelsProps) {
  const { width } = useWindowSize();
  const { t } = useTranslation("translations");

  if (!properties) {
    return null;
  }

  return (
    <>
      <section
        className="container xl:max-w-5xl mx-auto pt-16"
        id="models-section"
      >
        <div className="flex flex-row justify-between items-center">
          <h3 className="font-bold">
            {properties?.length === 1 ? t("model") : t("models")}{" "}
            {project?.name}
          </h3>
          <div className="flex flex-row gap-4">{actions}</div>
        </div>
        <hr className="my-6 border-primary" />
      </section>
      {properties?.length === 1 ? (
        <div className="flex flex-row justify-center">
          <ModelCard
            model={properties[0]}
            projectName={toUrlCase(project?.short_name ?? "")}
            orientation="horizontal"
            className="mx-8  rounded-lg lg:rounded-2xl"
            showHidden={showHidden}
          />
        </div>
      ) : (
        <Carousel
          className={`max-w-7xl mx-auto relative overflow-hidden`}
          opts={{
            dragFree: true,
          }}
        >
          <CarouselContent
            style={{
              marginLeft:
                properties.length > 2
                  ? 0
                  : width && width < 768
                  ? 16
                  : undefined,
              marginRight:
                properties.length > 2
                  ? 0
                  : width && width < 768
                  ? 16
                  : undefined,
            }}
          >
            {properties?.map((property, index) => (
              <CarouselItem
                key={index}
                className="basis-auto max-w-full min-w-0 pl-4 pb-8"
              >
                <ModelCard
                  className="lg:h-[240px] lg:w-[680px] border-none shadow-card"
                  model={property}
                  projectName={toUrlCase(project?.short_name ?? "")}
                  showHidden={showHidden}
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="md:right-2 lg:right-4 xl:right-6 z-20" />
          <CarouselPrevious className="md:left-2 lg:left-4 xl:left-6 z-20" />
        </Carousel>
      )}
    </>
  );
}
