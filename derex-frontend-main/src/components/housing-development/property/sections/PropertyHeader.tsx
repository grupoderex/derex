import { EdgeLogo } from "@/components/icons/EdgeLogo";
import { LowestPriceProperty } from "@/components/LowestPriceProperty";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Project } from "@/models/project";
import { type Property } from "@/models/property";
import { getResourceUrl } from "@/utils/image.utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";

import { useFavorites, useToggleFavorite } from "@/hooks/useAppQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";

interface PropertyHeaderProps {
  project?: Project;
  property?: Property;
  lowestPrice?: number;
}

export function PropertyHeader({
  project,
  property,
  lowestPrice,
}: PropertyHeaderProps) {
  const { t } = useTranslation("translations");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const openLogin = useUIStore((state) => state.openLogin);

  const { data: favoritesData } = useFavorites();

  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const isFavorite = useMemo(
    () => favoritesData?.favorites?.some((fav) => fav.id === property?.id),
    [favoritesData, property]
  );

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      toggleFavorite(property?.id ?? 0);
    } else {
      openLogin();
    }
  };


  return (
    <>
      <section
        className={`relative transition-all duration-300 ease-in overflow-hidden ${
          !property?.main_image?.trim() ? "max-h-96" : "max-h-screen"
        }`}
      >
        {property?.main_image && getResourceUrl(property.main_image) && (
          <Image
            src={getResourceUrl(property.main_image)!}
            alt={property?.main_image_alt_text ?? "Property Image"}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-64 lg:h-auto lg:max-h-[70vh] object-cover z-0"
            priority={true}
          />
        )}
        <div className="model-gradient"></div>
        <div className="lg:absolute bottom-0 left-[50%] lg:translate-x-[-50%] w-full flex flex-col gap-8 -mt-16 lg:mt-0 z-20 [&>*]:z-20 xl:max-w-5xl container">
          <div className="flex flex-col gap-6">
            {project?.logo_color && getResourceUrl(project.logo_color) && (
              <Image
                width={128}
                height={128}
                loading="lazy"
                className="w-32 h-32 bg-white rounded-md object-contain p-2 border"
                src={getResourceUrl(project.logo_color)!}
                alt={project?.logo_color_alt_text ?? "Logo del proyecto"}
              />
            )}
            <div className="flex flex-col gap-4 lg:gap-8">
              <h1 className="text-3xl lg:text-5xl">{property?.name}</h1>
            </div>
          </div>
          <div>
            {lowestPrice && lowestPrice > 0 ? (
              <>
                <h6 className="text-foreground/70  text-lg lg:text-2xl">
                  {t("fromPrice")}
                </h6>
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <h3 className="text-primary text-3xl lg:text-5xl">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,                      
                    }).format(lowestPrice)}
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost">{t("viewAllPrices")}</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogTitle className="sr-only">{t("viewAllPrices")}</DialogTitle>
                      <LowestPriceProperty
                        properties={property}
                        project={project}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            ) : (
              <h3 className="text-primary">{t("contactConsultant")}</h3>
            )}
          </div>
        </div>
      </section>
      <section className="mt-8 flex flex-col xl:max-w-5xl lg:mx-auto container">
        {project && project.credit_types.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-4">
            <span className="whitespace-nowrap">{t("creditTypes")}</span>
            <div className="flex flex-row items-center gap-2 flex-wrap">
              {project.credit_types.map((creditName, index) => (
                <Fragment key={index}>
                  <span
                    key={index}
                    className="font-display text-sm lg:text-base font-bold"
                  >
                    {creditName}
                  </span>
                  {index < project.credit_types.length - 1 && (
                    <span className="mx-1  font-bold">|</span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex flex-col-reverse md:flex-row gap-4 justify-between md:items-end">
          <div className="flex flex-col lg:flex-row gap-4">
            <Button asChild>
              <Link
                to="features-section"
                className="flex items-center cursor-pointer"
                smooth
              >
                {t("knowMore")}
                <Icon
                  icon="heroicons-solid:arrow-down"
                  width="24"
                  className="ml-2"
                />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                to="gallery-section"
                className="flex items-center cursor-pointer"
                smooth
              >
                {t("photoGallery")}
                <Icon
                  icon="heroicons-solid:camera"
                  width="24"
                  className="ml-2"
                />
              </Link>
            </Button>
            {/* <Button
              variant="ghost"
              disabled={isPending}
              onClick={handleFavoriteClick}
              aria-label={
                isFavorite ? "Eliminar de favoritos" : "Guardar en favoritos"
              }
            >
              {t("save")}
              {isPending ? (
                <Loader className="ml-2" />
              ) : isFavorite ? (
                <Icon
                  icon="heroicons-solid:heart"
                  width="24"
                  className="ml-2 text-red-600"
                />
              ) : (
                <Icon
                  icon="heroicons-outline:heart"
                  width="24"
                  className="ml-2"
                />
              )}
            </Button> */}
          </div>
          {!!property?.isEdgeCertified && <EdgeLogo />}
        </div>
      </section>
    </>
  );
}
