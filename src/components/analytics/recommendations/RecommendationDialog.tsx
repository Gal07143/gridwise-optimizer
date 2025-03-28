
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SystemRecommendation } from '@/hooks/usePredictions';
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useState } from 'react';

interface RecommendationDialogProps {
  recommendation: SystemRecommendation;
  onApply: () => void;
  isApplying: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecommendationDialog = ({
  recommendation,
  onApply,
  isApplying,
  open,
  onOpenChange
}: RecommendationDialogProps) => {
  const [notes, setNotes] = useState('');

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Apply Recommendation</DialogTitle>
        <DialogDescription>
          You're about to apply the recommendation: {recommendation.title}
        </DialogDescription>
      </DialogHeader>
      
      <div className="my-4">
        <p className="text-sm mb-4">{recommendation.description}</p>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Implementation Notes</label>
            <Textarea
              placeholder="Add any notes about how you're implementing this recommendation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button 
          onClick={onApply}
          disabled={isApplying}
        >
          {isApplying ? 'Applying...' : 'Apply Recommendation'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default RecommendationDialog;
