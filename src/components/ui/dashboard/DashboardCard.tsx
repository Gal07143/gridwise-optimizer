
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
  loadingHeight?: number;
}

export const DashboardCard = React.forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ title, description, footer, children, isLoading = false, loadingHeight = 100, className, ...props }, ref) => {
    if (isLoading) {
      return (
        <Card className={cn("overflow-hidden", className)} {...props} ref={ref}>
          {title && (
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/2" />
              {description && <Skeleton className="h-4 w-3/4 mt-2" />}
            </CardHeader>
          )}
          <CardContent>
            <Skeleton className={`w-full rounded-md`} style={{ height: loadingHeight }} />
          </CardContent>
          {footer && (
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          )}
        </Card>
      );
    }

    return (
      <Card className={cn("overflow-hidden", className)} {...props} ref={ref}>
        {title && (
          <CardHeader className="pb-2">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    );
  }
);

DashboardCard.displayName = "DashboardCard";

export default DashboardCard;
