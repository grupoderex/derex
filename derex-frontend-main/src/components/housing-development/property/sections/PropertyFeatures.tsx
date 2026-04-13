import {
  PropertyAmenity,
  PropertyAmenityType,
} from "@/components/PropertyAmenity";
import { MetadataTitle } from "@/models/metadata";
import { type Property } from "@/models/property";
import { useTranslation } from "react-i18next";

function renderWithParagraphs(text: string | null | undefined) {
  if (!text) return null;
  return text.split(/\n+/).map((paragraph, index) => (
    <p key={index} className="mb-3 last:mb-0">
      {paragraph}
    </p>
  ));
}

interface PropertyFeaturesProps {
  property?: Property;
  propertyTitles?: Record<string, MetadataTitle>;
}

export function PropertyFeatures({ property, propertyTitles }: PropertyFeaturesProps) {
  const { i18n } = useTranslation("translations");



  if (!property) {
    return <></>;
  }

  return (
    <section
      className="container xl:max-w-5xl mx-auto pt-16"
      id="features-section"
    >
      <h4 className={`${propertyTitles?.prototypes_virtualTour?.className} font-display text-4xl`}>
        {i18n.language === "en"
          ? propertyTitles?.prototypes_features?.value_en
          : propertyTitles?.prototypes_features?.value}
      </h4>
      <hr className="my-6 border-primary" />

      <div className="mb-6">
        {renderWithParagraphs(
          i18n.language === "es"
            ? property.description
            : property.description_eng
        )}
      </div>

      <div className="flex flex-row gap-12 flex-wrap mb-6">
        <PropertyAmenity
          size={40}
          type={PropertyAmenityType.Land}
          disapearOnZero
          quantity={property.square_meters}
        />
        <PropertyAmenity
          size={40}
          type={PropertyAmenityType.Floors}
          disapearOnZero
          quantity={property.floors}
        />
        <PropertyAmenity
          size={40}
          type={PropertyAmenityType.Rooms}
          disapearOnZero
          quantity={property.rooms}
        />
        <PropertyAmenity
          size={40}
          type={PropertyAmenityType.Bathrooms}
          disapearOnZero
          quantity={property.bathrooms + (property.restrooms ?? 0) / 2}
        />
        <PropertyAmenity
          size={40}
          disapearOnZero
          type={
            property.cars_garage_capacity > property.cars_parking_lot_capacity
              ? PropertyAmenityType.Garage
              : PropertyAmenityType.Parking
          }
          quantity={Math.max(
            property.cars_garage_capacity,
            property.cars_parking_lot_capacity
          )}
        />
      </div>
     
    </section>
  );
}
