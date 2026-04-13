interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export const Label = ({ children, className }: LabelProps) => {
  return (
    <label className={"text-gray-500 uppercase mb-3 " + className}>
      {children}
    </label>
  );
};
