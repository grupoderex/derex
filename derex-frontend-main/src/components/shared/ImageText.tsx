import { Img } from "@/views/Img";

interface ImageWithTextProps {
  src: string;
  children: React.ReactNode;
  className?: string;
  alt?: string;
}

export const ImageWithText = ({
  src,
  children,
  className,
  alt,
}: ImageWithTextProps) => {
  return (
    <div className={`relative m-5 text-gray-50 ${className}`}>
      <Img
        className="brightness-50 object-cover h-[500px] rounded-lg w-full"
        src={src}
        alt={alt}
      />
      <p className="absolute brightness-100 text-2xl md:text-4xl bottom-8 font-bold left-5 uppercase">
        {children}
      </p>
    </div>
  );
};
