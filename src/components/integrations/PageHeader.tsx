
import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  categoryName: string;
  categoryId?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ categoryName, categoryId }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold mb-1">{categoryName}</h1>
        <p className="text-muted-foreground">
          Browse and manage {categoryName.toLowerCase()} integrations by manufacturer
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        
        <Button asChild>
          <Link to={`/integrations/add-device-model${categoryId ? `?type=${categoryId}` : ''}`}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add {categoryName.slice(0, -1)}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
