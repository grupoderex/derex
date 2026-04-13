interface ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ children, className }: ButtonProps) => {
  return (
    <button
      className={
        "bg-primary p-3 rounded-md text-gray-50 font-bold " + className
      }
    >
      {children}
    </button>
  );
};
