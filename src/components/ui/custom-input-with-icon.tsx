
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CustomInputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

const CustomInputWithIcon = forwardRef<HTMLInputElement, CustomInputWithIconProps>(
  ({ className, icon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            className={cn(
              "flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-indigo-400",
              icon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-400 focus-visible:ring-red-400",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

CustomInputWithIcon.displayName = "CustomInputWithIcon";

export { CustomInputWithIcon };
