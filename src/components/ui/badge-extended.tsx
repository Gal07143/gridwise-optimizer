
import React, { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: 
          "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        info: 
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]", 
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeExtendedProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  count?: number;
  isAnimated?: boolean;
}

export function BadgeExtended({
  className,
  variant,
  size,
  icon,
  iconPosition = 'left',
  count,
  isAnimated = false,
  children,
  ...props
}: BadgeExtendedProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size }),
        isAnimated && "animate-pulse",
        "flex items-center gap-1.5",
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-grow">{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      {count !== undefined && (
        <span className={cn(
          "inline-flex items-center justify-center rounded-full bg-white bg-opacity-25 px-1.5 py-0.5 text-[10px] font-medium",
          size === "sm" ? "ml-1" : "ml-1.5",
          size === "lg" ? "ml-2" : ""
        )}>
          {count}
        </span>
      )}
    </div>
  );
}
