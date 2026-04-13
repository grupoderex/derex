import { Loader2, type LucideProps } from "lucide-react";

export function Loader({ className, ...props }: LucideProps) {
  return <Loader2 className={`mr-2 animate-spin ${className}`} {...props} />;
}
