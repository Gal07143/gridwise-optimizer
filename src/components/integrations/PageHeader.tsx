
import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, PlusCircle, Download, Upload, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface PageHeaderProps {
  categoryName: string;
  categoryId?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ categoryName, categoryId }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{categoryName}</h1>
          <Badge variant="outline" className="font-normal">
            {categoryId || 'All'}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Browse and manage {categoryName.toLowerCase()} integrations by manufacturer
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter devices by criteria</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export device list</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import device configurations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="default" size="sm">
                <Link to={`/integrations/add-device-model${categoryId ? `?type=${categoryId}` : ''}`}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add {categoryName.slice(0, -1)}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a new {categoryName.toLowerCase().slice(0, -1)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
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
      </div>
    </div>
  );
};

export default PageHeader;
