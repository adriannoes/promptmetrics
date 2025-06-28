
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ViewCustomizationOptions } from '@/types/demo';
import { availableLLMs, availableCompetitors } from '@/data/demoData';

interface ViewCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewOptions: ViewCustomizationOptions;
  onSave: (options: ViewCustomizationOptions) => void;
}

export const ViewCustomizationModal: React.FC<ViewCustomizationModalProps> = ({
  isOpen,
  onClose,
  viewOptions,
  onSave
}) => {
  const [localOptions, setLocalOptions] = React.useState<ViewCustomizationOptions>(viewOptions);

  React.useEffect(() => {
    setLocalOptions(viewOptions);
  }, [viewOptions]);

  const handleLLMToggle = (llm: string, checked: boolean) => {
    setLocalOptions(prev => ({
      ...prev,
      selectedLLMs: checked 
        ? [...prev.selectedLLMs, llm]
        : prev.selectedLLMs.filter(l => l !== llm)
    }));
  };

  const handleCompetitorToggle = (competitor: string, checked: boolean) => {
    setLocalOptions(prev => ({
      ...prev,
      selectedCompetitors: checked 
        ? [...prev.selectedCompetitors, competitor]
        : prev.selectedCompetitors.filter(c => c !== competitor)
    }));
  };

  const handleSave = () => {
    onSave(localOptions);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize View</DialogTitle>
          <DialogDescription>
            Choose which LLMs and competitors to display in the analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">LLMs to Display</h3>
            <div className="space-y-2">
              {availableLLMs.map((llm) => (
                <div key={llm} className="flex items-center space-x-2">
                  <Checkbox
                    id={`llm-${llm}`}
                    checked={localOptions.selectedLLMs.includes(llm)}
                    onCheckedChange={(checked) => handleLLMToggle(llm, checked as boolean)}
                  />
                  <Label htmlFor={`llm-${llm}`} className="text-sm">
                    {llm}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Competitors to Display</h3>
            <div className="space-y-2">
              {availableCompetitors.map((competitor) => (
                <div key={competitor} className="flex items-center space-x-2">
                  <Checkbox
                    id={`competitor-${competitor}`}
                    checked={localOptions.selectedCompetitors.includes(competitor)}
                    onCheckedChange={(checked) => handleCompetitorToggle(competitor, checked as boolean)}
                  />
                  <Label htmlFor={`competitor-${competitor}`} className="text-sm">
                    {competitor}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
