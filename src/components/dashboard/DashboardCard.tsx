
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "outline" | "secondary" | "success"; // Custom type to include success
  headerClassName?: string;
  rightHeaderContent?: ReactNode;
}

// Create a custom badge component that supports the "success" variant
const ExtendedBadge = ({ variant, ...props }: { 
  variant?: "default" | "destructive" | "outline" | "secondary" | "success", 
  [key: string]: any 
}) => {
  // Map our extended variants to the actual Badge component variants
  const badgeVariant = variant === "success" 
    ? "outline" // Use outline for success
    : variant as "default" | "destructive" | "outline" | "secondary";
  
  // Apply custom styling for success
  const className = variant === "success" 
    ? "border-green-500 text-green-500 bg-green-50 dark:bg-green-950/20" 
    : "";
  
  return <Badge variant={badgeVariant} className={cn(className, props.className)} {...props} />;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  className,
  icon,
  isLoading = false,
  badge,
  badgeVariant = "default",
  headerClassName,
  rightHeaderContent,
}) => {
  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <CardHeader className={cn("pb-2", headerClassName)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {icon && <div className="mr-2 text-primary">{icon}</div>}
            <CardTitle className="text-lg">
              {isLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                title
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {badge && !isLoading && (
              <ExtendedBadge variant={badgeVariant}>
                {badge}
              </ExtendedBadge>
            )}
            {isLoading && (
              <Skeleton className="h-5 w-16" />
            )}
            {rightHeaderContent}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
