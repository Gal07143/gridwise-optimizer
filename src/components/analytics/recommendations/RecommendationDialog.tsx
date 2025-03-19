
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SystemRecommendation } from '@/services/predictions/energyPredictionService';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RecommendationDialogProps {
  recommendation: SystemRecommendation;
  notes: string;
  onNotesChange: (notes: string) => void;
  onApply: () => void;
  onCancel: () => void;
  isApplying: boolean;
}

const RecommendationDialog = ({
  recommendation,
  notes,
  onNotesChange,
  onApply,
  onCancel,
  isApplying
}: RecommendationDialogProps) => {
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
              onChange={(e) => onNotesChange(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onCancel}
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
