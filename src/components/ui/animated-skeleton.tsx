
import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'rectangular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
  repeat?: number;
  className?: string;
}

const AnimatedSkeleton = React.forwardRef<HTMLDivElement, AnimatedSkeletonProps>(
  ({ 
    className, 
    variant = "default",
    animation = "pulse",
    width,
    height,
    repeat = 1,
    ...props 
  }, ref) => {
    const skeletonClass = cn(
      "bg-muted relative overflow-hidden rounded-md",
      animation === "pulse" && "animate-pulse",
      animation === "wave" && "animate-skeleton-wave",
      variant === "circular" && "rounded-full",
      variant === "text" && "h-4 w-full rounded-sm",
      className
    );

    const style: React.CSSProperties = {
      width: width,
      height: height,
    };

    const items = Array.from({ length: repeat }).map((_, index) => (
      <div 
        key={index}
        className={skeletonClass} 
        style={style}
        ref={index === 0 ? ref : undefined}
        {...props}
      />
    ));

    return repeat > 1 ? (
      <div className="space-y-2">{items}</div>
    ) : (
      items[0]
    );
  }
);

AnimatedSkeleton.displayName = "AnimatedSkeleton";

export { AnimatedSkeleton };
