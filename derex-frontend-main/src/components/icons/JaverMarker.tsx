import Image from 'next/image';


interface JaverMarkerProps {
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const JaverMarker = ({
  size = 100,
  // color = "#CD1019",
  // className,
  // onClick,
}: JaverMarkerProps) => {
  const aspectRatio = 56 / 68;

  const width = size;
  const height = width / aspectRatio;

  return (
    <Image
      src="/archivos/derex-logo-map.webp"
      width={width}
      height={height}
      alt="pin mapa derex"
      style={{ height: "auto" }}
    />

  );
};
