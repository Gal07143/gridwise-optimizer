
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, icon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <Input
            className={cn(
              icon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-400 focus:border-red-400 focus:ring-red-400",
              "bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500",
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

CustomInput.displayName = "CustomInput";

export { CustomInput };
