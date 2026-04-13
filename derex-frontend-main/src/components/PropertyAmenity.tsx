import { type Translation } from "@/types/translation";
import { useTranslation } from "react-i18next";
// 1. Cambiamos el import de los iconos por el componente genérico
import { Icon } from "@iconify/react";

export enum PropertyAmenityType {
  Bathrooms = "Bathrooms",
  Parking = "Parking",
  Garage = "Garage",
  Floors = "Floors",
  Land = "Land",
  Rooms = "Rooms",
}

interface PropertyAmenityProps {
  type: PropertyAmenityType;
  quantity: number;
  className?: string;
  size?: number;
  iconClassName?: string;
  disapearOnZero?: boolean;
  isChip?: boolean;
}

// 2. El Record ahora guarda strings, no componentes
const Icons: Record<PropertyAmenityType, string> = {
  [PropertyAmenityType.Bathrooms]: "ph:bathtub",
  [PropertyAmenityType.Parking]: "ph:car",
  [PropertyAmenityType.Garage]: "ph:car",
  [PropertyAmenityType.Floors]: "heroicons:home-modern",
  [PropertyAmenityType.Land]: "heroicons:square-3-stack-3d",
  // Phosphor Duotone
  [PropertyAmenityType.Rooms]: "ph:bed-duotone",
};

const translations = {
  [PropertyAmenityType.Bathrooms]: "bathrooms_",
  [PropertyAmenityType.Parking]: "parkingLots_",
  [PropertyAmenityType.Garage]: "garageCapacity_",
  [PropertyAmenityType.Floors]: "floors_",
  [PropertyAmenityType.Land]: "landArea_",
  [PropertyAmenityType.Rooms]: "rooms_",
};

export function PropertyAmenity({
  type,
  quantity,
  className,
  iconClassName,
  size = 32,
  disapearOnZero = false,
  isChip = false,
}: PropertyAmenityProps) {
  // 3. Obtenemos el ID del icono
  const iconId = Icons[type];
  const { t } = useTranslation("translations");
  const numericQuantity = Number(quantity);
  const resolvedQuantity = Number.isFinite(numericQuantity)
    ? numericQuantity
    : 0;

  if (disapearOnZero && resolvedQuantity <= 0) {
    return null;
  }

  return (
    <div
      className={`flex ${
        isChip
          ? "flex-row items-center gap-2 bg-neutral-200 px-2 py-1 h-fit rounded justify-center"
          : "flex-col"
      }  ${className}`}
    >
      {/* 4. Renderizamos el componente Icon único */}
      <Icon
        icon={iconId}
        width={size} // Iconify usa 'width' para el tamaño
        className={`text-primary self-center ${iconClassName}`}
      />
      <div
        className={`text-sm text-center whitespace-nowrap overflow-hidden ${
          isChip ? "text-foreground" : "text-ellipsis"
        }`}
      >
        {isChip
          ? resolvedQuantity
          : t(
              `${translations[type]}${
                resolvedQuantity === 1 ? "one" : "other"
              }` as keyof Translation,
              {
                count: resolvedQuantity,
              }
            )}
      </div>
    </div>
  );
}
