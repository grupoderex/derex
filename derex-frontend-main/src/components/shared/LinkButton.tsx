import Link from "next/link";

interface LinkButtonProps {
  children: React.ReactNode;
  to: string;
}

export const LinkButton = ({ children, to }: LinkButtonProps) => {
  return (
    <Link href={to} className="bg-primary p-3 rounded-md text-gray-50 font-bold">
      {children}
    </Link>
  );
};
