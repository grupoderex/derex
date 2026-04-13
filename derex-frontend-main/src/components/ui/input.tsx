import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  parentClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, parentClassName, ...props }, ref) => {
    return (
      <div className={parentClassName}>
        <input
          type={type}
          className={cn(
            "text-foreground flex h-10 w-full rounded-md border border-input bg-neutral-100 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {props.error && (
          <div className="text-red-500 text-sm mx-2">{props.error}</div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
