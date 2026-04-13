import { Icon } from "@iconify/react";
import { MixedDevelopmentIcon } from "./MixedDevelopmentIcon";

export const DevelopmentOrientationIcon = ({
  orientation,
  size = 32,
  className,
}: {
  orientation: "horizontal" | "vertical" | "mixed" | "previous";
  size?: number;
  className?: string;
}) => {
  switch (orientation) {
    case "horizontal":
      return (
        <Icon icon="heroicons:home-modern" className={className} width={size} />
      );
    case "vertical":
      return (
        <Icon
          icon="heroicons:building-office-2"
          className={className}
          width={size}
        />
      );
    case "mixed":
      return <MixedDevelopmentIcon className={className} size={size} />;
    case "previous":
      return (
        <Icon icon="heroicons:archive-box" className={className} width={size} />
      );
    default:
      return (
        <Icon icon="heroicons:home-modern" className={className} width={size} />
      );
  }
};
