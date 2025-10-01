

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye } from 'lucide-react';
import { allLlms, allCompetitors } from '@/constants/PromptAnalysisData';

interface PromptCustomizeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLlms: string[];
  selectedCompetitors: string[];
  onLlmToggle: (llmId: string) => void;
  onCompetitorToggle: (competitorId: string) => void;
}

export const PromptCustomizeDialog = ({
  isOpen,
  onOpenChange,
  selectedLlms,
  selectedCompetitors,
  onLlmToggle,
  onCompetitorToggle,
}: PromptCustomizeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Customize view
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize View</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Select LLMs to Display</h3>
            <div className="grid grid-cols-2 gap-4">
              {allLlms.map((llm) => (
                <div key={llm.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`llm-${llm.id}`}
                    checked={selectedLlms.includes(llm.id)}
                    onCheckedChange={() => onLlmToggle(llm.id)}
                  />
                  <label
                    htmlFor={`llm-${llm.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {llm.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Select Competitors to Display</h3>
            <div className="grid grid-cols-2 gap-4">
              {allCompetitors.map((competitor) => (
                <div key={competitor.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`competitor-${competitor.id}`}
                    checked={selectedCompetitors.includes(competitor.id)}
                    onCheckedChange={() => onCompetitorToggle(competitor.id)}
                  />
                  <label
                    htmlFor={`competitor-${competitor.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {competitor.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Apply Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
