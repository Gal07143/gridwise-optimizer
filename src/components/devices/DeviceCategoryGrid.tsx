
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { DeviceModelCategory } from '@/types/device-catalog';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface DeviceCategoryGridProps {
  categories: DeviceModelCategory[];
}

const DeviceCategoryGrid: React.FC<DeviceCategoryGridProps> = ({ categories }) => {
  const navigate = useNavigate();
  
  // This resolves Lucide icon names dynamically
  const getIconByName = (name: string) => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) {
      return LucideIcons.HelpCircle;
    }
    return IconComponent;
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        const Icon = getIconByName(category.icon);
        
        return (
          <Card 
            key={category.id} 
            className={cn(
              "cursor-pointer hover:bg-accent/50 transition-colors",
              "border border-border hover:border-primary/20"
            )}
            onClick={() => navigate(`/devices/category/${category.id}`)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DeviceCategoryGrid;
