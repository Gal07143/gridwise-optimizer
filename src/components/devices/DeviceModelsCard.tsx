
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DeviceModel } from '@/types/device';

interface DeviceModelsCardProps {
  model: DeviceModel;
  onSelect?: (model: DeviceModel) => void;
  showAddButton?: boolean;
}

const DeviceModelsCard: React.FC<DeviceModelsCardProps> = ({ 
  model, 
  onSelect,
  showAddButton = false
}) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{model.name}</CardTitle>
        <CardDescription>{model.manufacturer}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground">Type:</div>
            <div>{model.device_type}</div>
            
            <div className="text-muted-foreground">Model:</div>
            <div>{model.model_number || 'N/A'}</div>
            
            {model.power_rating && (
              <>
                <div className="text-muted-foreground">Power Rating:</div>
                <div>{model.power_rating} W</div>
              </>
            )}
            
            {model.category && (
              <>
                <div className="text-muted-foreground">Category:</div>
                <div>{model.category}</div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          {onSelect && showAddButton && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSelect(model)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="ml-auto"
          >
            <Link to={`/devices/models/${model.id}`}>
              Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceModelsCard;
