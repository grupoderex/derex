import { Card, CardContent } from "./ui/card";
import { PropertyAmenity, PropertyAmenityType } from "./PropertyAmenity";
import { type PropertySearch } from "@/models/property_search";

type SelectableModelCardProps = React.HTMLAttributes<HTMLDivElement> & {
  model: PropertySearch;
  projectName: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export const SelectableModelCard = ({
  model,
  projectName,
  className,
  isSelected = false,
  ...props
}: SelectableModelCardProps) => {
  return (
    <Card
      {...props}
      className={`flex cursor-pointer group hover:bg-primary ${isSelected ? "bg-primary" : ""} ${className}`}
    >
      <CardContent className={`grow p-4`}>
        <div
          className={`text-center font-display font-bold text-lg group-hover:text-white ${isSelected ? "text-white" : ""}`}
        >
          {model.name}
        </div>
        <div className="flex flex-row gap-3 mt-4">
          <PropertyAmenity
            type={PropertyAmenityType.Rooms}
            quantity={model.rooms}
            size={16}
            isChip
          />
          <PropertyAmenity
            type={PropertyAmenityType.Bathrooms}
            quantity={model.bathrooms + (model.restrooms ?? 0) / 2}
            size={16}
            isChip
          />
          <PropertyAmenity
            type={
              model.cars_garage_capacity > model.cars_parking_lot_capacity
                ? PropertyAmenityType.Garage
                : PropertyAmenityType.Parking
            }
            quantity={Math.max(
              model.cars_garage_capacity,
              model.cars_parking_lot_capacity
            )}
            size={16}
            isChip
          />
        </div>
      </CardContent>
    </Card>
  );
};
