
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchEnergyCategories } from '@/services/myems';
import type { EnergyCategory } from '@/types/myems';
import { Zap, Flame, Droplet, Thermometer, Sun } from 'lucide-react';

interface EnergyCategoryProps {
  category: EnergyCategory;
  onSelect?: (category: EnergyCategory) => void;
  isSelected?: boolean;
}

const getCategoryIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'zap':
      return <Zap />;
    case 'flame':
      return <Flame />;
    case 'droplet':
      return <Droplet />;
    case 'thermometer':
      return <Thermometer />;
    case 'sun':
      return <Sun />;
    default:
      return <Zap />;
  }
};

const EnergyCategoryItem: React.FC<EnergyCategoryProps> = ({ category, onSelect, isSelected }) => {
  return (
    <div 
      className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-accent ${isSelected ? 'bg-accent' : ''}`}
      onClick={() => onSelect && onSelect(category)}
    >
      <div 
        className="p-2 rounded-full mr-3" 
        style={{ backgroundColor: category.display_color || '#e2e2e2' }}
      >
        {getCategoryIcon(category.icon)}
      </div>
      <div>
        <h4 className="font-medium">{category.name}</h4>
        <p className="text-sm text-muted-foreground">Unit: {category.unit}</p>
      </div>
    </div>
  );
};

interface EnergyCategoryListProps {
  onSelectCategory?: (category: EnergyCategory) => void;
  selectedCategoryId?: string;
}

const EnergyCategoryList: React.FC<EnergyCategoryListProps> = ({ 
  onSelectCategory,
  selectedCategoryId
}) => {
  const [categories, setCategories] = useState<EnergyCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const data = await fetchEnergyCategories();
      setCategories(data);
      setLoading(false);
    };

    loadCategories();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Energy Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map(category => (
              <EnergyCategoryItem 
                key={category.id} 
                category={category}
                onSelect={onSelectCategory}
                isSelected={selectedCategoryId === category.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No energy categories found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyCategoryList;
