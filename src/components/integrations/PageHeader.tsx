
import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, PlusCircle, Download, Upload, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface PageHeaderProps {
  categoryName: string;
  categoryId?: string;
  hiddenFeatures?: string[];
  actionRoute?: string;
  additionalButtons?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  categoryName, 
  categoryId, 
  hiddenFeatures = [], 
  actionRoute,
  additionalButtons 
}) => {
  const shouldShowFeature = (feature: string) => !hiddenFeatures.includes(feature);
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{categoryName}</h1>
          {categoryId && (
            <Badge variant="outline" className="font-normal">
              {categoryId || 'All'}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Browse and manage {categoryName.toLowerCase()}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {shouldShowFeature('filter') && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter by criteria</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {shouldShowFeature('export') && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {shouldShowFeature('import') && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {shouldShowFeature('add') && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="default" size="sm">
                  <Link to={actionRoute || (categoryId ? `/integrations/add-device-model?type=${categoryId}` : '/integrations/add-device-model')}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add {categoryName.endsWith('s') ? categoryName.slice(0, -1) : categoryName}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new {categoryName.toLowerCase().endsWith('s') ? categoryName.toLowerCase().slice(0, -1) : categoryName.toLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {additionalButtons}
        
        {shouldShowFeature('help') && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View help documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
