interface MarkProps {
  children: React.ReactNode;
}

export const Mark = ({ children }: MarkProps) => {
  return (
    <mark className="bg-transparent font-bold text-primary">{children}</mark>
  );
};
