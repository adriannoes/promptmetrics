
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Edit, Plus, Eye } from 'lucide-react';
import { PromptCustomizeDialog } from './PromptCustomizeDialog';
import { promptsData, allCompetitors } from '@/constants/PromptAnalysisData';

interface PromptTableProps {
  selectedLlms: string[];
  selectedCompetitors: string[];
  onLlmToggle: (llmId: string) => void;
  onCompetitorToggle: (competitorId: string) => void;
}

const VolumeIndicator = ({ volume }: { volume: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`w-1 h-4 rounded ${
            bar <= volume ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

const PresenceRankCell = ({ data }: { data: { present: boolean; rank: number | null } }) => {
  if (!data.present) {
    return <Badge variant="secondary" className="bg-red-100 text-red-700">No</Badge>;
  }
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="bg-green-100 text-green-700">Yes</Badge>
      <span className="text-sm font-medium">{data.rank}</span>
    </div>
  );
};

export const PromptTable = ({
  selectedLlms,
  selectedCompetitors,
  onLlmToggle,
  onCompetitorToggle,
}: PromptTableProps) => {
  const [isCustomizeViewOpen, setIsCustomizeViewOpen] = useState(false);

  const filteredPromptsData = promptsData.map(prompt => ({
    ...prompt,
    llmData: prompt.llmData.filter(llmRow => selectedLlms.includes(llmRow.llm))
  }));

  const visibleCompetitors = allCompetitors.filter(comp => selectedCompetitors.includes(comp.id));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Prompts
          </CardTitle>
          <div className="flex items-center gap-2">
            <PromptCustomizeDialog
              isOpen={isCustomizeViewOpen}
              onOpenChange={setIsCustomizeViewOpen}
              selectedLlms={selectedLlms}
              selectedCompetitors={selectedCompetitors}
              onLlmToggle={onLlmToggle}
              onCompetitorToggle={onCompetitorToggle}
            />
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit prompts
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add new prompt
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Local:</span>
            <span className="font-medium">Global</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Language:</span>
            <span className="font-medium">English</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Showing:</span>
            <span className="font-medium">5 prompts</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto min-h-96 h-[80vh] relative">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10 border-b">
              <TableRow>
                <TableHead className="bg-white">Prompt</TableHead>
                <TableHead className="bg-white">LLM</TableHead>
                {visibleCompetitors.map((competitor) => (
                  <TableHead key={competitor.id} className="text-center bg-white">
                    <div className="flex items-center justify-center gap-2">
                      {competitor.name}<br />Present | Rank
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromptsData.map((prompt) => (
                prompt.llmData.map((llmRow, index) => (
                  <TableRow key={`${prompt.prompt}-${llmRow.llm}`}>
                    {index === 0 && (
                      <TableCell rowSpan={prompt.llmData.length} className="font-medium align-top">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-2">
                            <span>{prompt.prompt}</span>
                            <div className="flex items-center gap-2">
                              <VolumeIndicator volume={prompt.volume} />
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>{llmRow.llm}</TableCell>
                    {visibleCompetitors.map((competitor) => (
                      <TableCell key={competitor.id} className="text-center">
                        <PresenceRankCell data={llmRow[competitor.id as keyof typeof llmRow] as { present: boolean; rank: number | null }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
