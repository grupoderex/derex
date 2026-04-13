interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Title = ({ children, className }: TitleProps) => {
  return (
    <h1
      className={
        "text-center font-display font-bold [&>*]:font-display !text-3xl md:!text-5xl uppercase text-neutral-400 my-10 " +
        className
      }
    >
      {children}
    </h1>
  );
};
