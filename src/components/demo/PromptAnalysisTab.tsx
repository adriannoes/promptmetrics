
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Download, Filter, Settings, RefreshCw, Edit, Plus, Info, Eye } from 'lucide-react';
import { mockPrompts } from '@/data/demoData';
import { enhancedMockPrompts, availableLLMs, availableCompetitors } from '@/data/demoData';
import { FilterState, CustomizationOptions, ViewCustomizationOptions } from '@/types/demo';
import { filterPrompts, getUniqueValues } from '@/utils/demoUtils';
import { ViewCustomizationModal } from './ViewCustomizationModal';
import { PresenceRankCell } from './PresenceRankCell';
import { VolumeIndicator } from './VolumeIndicator';

interface PromptAnalysisTabProps {
  filters: FilterState;
  customization: CustomizationOptions;
  updateFilter: (key: keyof FilterState, value: string | undefined) => void;
  updateCustomization: (key: keyof CustomizationOptions, value: boolean) => void;
  resetFilters: () => void;
}

const ITEMS_PER_PAGE = 10;

export const PromptAnalysisTab: React.FC<PromptAnalysisTabProps> = ({
  filters,
  customization,
  updateFilter,
  updateCustomization,
  resetFilters
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [viewOptions, setViewOptions] = useState<ViewCustomizationOptions>({
    selectedLLMs: availableLLMs,
    selectedCompetitors: availableCompetitors
  });

  const filteredPrompts = filterPrompts(mockPrompts, filters);
  const uniqueCategories = getUniqueValues(mockPrompts, 'category');
  const uniqueRegions = getUniqueValues(mockPrompts, 'region');
  const uniqueIndustries = getUniqueValues(mockPrompts, 'industry');

  // Calculate pagination
  const totalPages = Math.ceil(enhancedMockPrompts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPrompts = enhancedMockPrompts.slice(startIndex, endIndex);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    updateFilter(key, value === 'all' ? undefined : value);
  };

  const handleViewOptionsChange = (newOptions: ViewCustomizationOptions) => {
    setViewOptions(newOptions);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Analysis Options
            </CardTitle>
            <CardDescription>Filter and customize your prompt analysis view</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Sentiment</Label>
                <Select value={filters.sentiment || 'all'} onValueChange={(value) => handleFilterChange('sentiment', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All sentiments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sentiments</SelectItem>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Region</Label>
                <Select value={filters.region || 'all'} onValueChange={(value) => handleFilterChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {uniqueRegions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Industry</Label>
                <Select value={filters.industry || 'all'} onValueChange={(value) => handleFilterChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All industries</SelectItem>
                    {uniqueIndustries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customization Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Display Customization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-confidence"
                  checked={customization.showConfidence}
                  onCheckedChange={(checked) => updateCustomization('showConfidence', checked)}
                />
                <Label htmlFor="show-confidence">Show Confidence</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-timestamp"
                  checked={customization.showTimestamp}
                  onCheckedChange={(checked) => updateCustomization('showTimestamp', checked)}
                />
                <Label htmlFor="show-timestamp">Show Timestamp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-source"
                  checked={customization.showSource}
                  onCheckedChange={(checked) => updateCustomization('showSource', checked)}
                />
                <Label htmlFor="show-source">Show Source</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-keywords"
                  checked={customization.showKeywords}
                  onCheckedChange={(checked) => updateCustomization('showKeywords', checked)}
                />
                <Label htmlFor="show-keywords">Show Keywords</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="compact-view"
                  checked={customization.compactView}
                  onCheckedChange={(checked) => updateCustomization('compactView', checked)}
                />
                <Label htmlFor="compact-view">Compact View</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="highlight-priority"
                  checked={customization.highlightHighPriority}
                  onCheckedChange={(checked) => updateCustomization('highlightHighPriority', checked)}
                />
                <Label htmlFor="highlight-priority">Highlight High Priority</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prompts Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prompts</CardTitle>
                <CardDescription>Analysis of prompt presence and ranking across LLMs</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit prompts
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add new prompt
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Location and Language Settings */}
            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Local:</Label>
                <Badge variant="outline">Global</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Language:</Label>
                <Badge variant="outline">English</Badge>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming soon: choose your preferred Local and Language</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Customize View Button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {enhancedMockPrompts.length} prompts total
                </Badge>
                <Badge variant="outline">
                  Page {currentPage} of {totalPages}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCustomizationModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Customize View
              </Button>
            </div>

            {/* Multi-row Table */}
            <div className="relative overflow-auto max-h-[600px] border rounded-lg">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="bg-background border-r">Prompt</TableHead>
                    <TableHead className="bg-background border-r">LLM</TableHead>
                    <TableHead className="bg-background border-r">Lovable</TableHead>
                    {viewOptions.selectedCompetitors.map(competitor => (
                      <TableHead key={competitor} className="bg-background border-r">
                        {competitor}
                      </TableHead>
                    ))}
                    <TableHead className="bg-background border-r">Details</TableHead>
                    <TableHead className="bg-background">Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPrompts.map((prompt) => {
                    const filteredLLMData = prompt.llmData.filter(llm => 
                      viewOptions.selectedLLMs.includes(llm.llm)
                    );
                    
                    return filteredLLMData.map((llmData, llmIndex) => (
                      <TableRow key={`${prompt.id}-${llmData.llm}`}>
                        {llmIndex === 0 && (
                          <TableCell 
                            rowSpan={filteredLLMData.length} 
                            className="border-r align-top p-4 max-w-xs"
                          >
                            <div className="space-y-1">
                              <p className="text-sm">{prompt.prompt}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Badge variant="secondary" className="text-xs">
                                  {prompt.category}
                                </Badge>
                                <span>•</span>
                                <span>{prompt.priority} Priority</span>
                              </div>
                            </div>
                          </TableCell>
                        )}
                        
                        <TableCell className="border-r">
                          <Badge variant="outline" className="text-sm">
                            {llmData.llm}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="border-r">
                          <PresenceRankCell
                            presence={llmData.lovablePresence}
                            rank={llmData.lovableRank}
                            brand="Lovable"
                          />
                        </TableCell>
                        
                        {viewOptions.selectedCompetitors.map(competitor => (
                          <TableCell key={competitor} className="border-r">
                            <PresenceRankCell
                              presence={llmData.competitors[competitor]?.presence || false}
                              rank={llmData.competitors[competitor]?.rank}
                              brand={competitor}
                            />
                          </TableCell>
                        ))}
                        
                        <TableCell className="border-r">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            View Details
                          </Button>
                        </TableCell>
                        
                        {llmIndex === 0 && (
                          <TableCell rowSpan={filteredLLMData.length} className="align-top p-4">
                            <VolumeIndicator volume={prompt.volume} />
                          </TableCell>
                        )}
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        {/* Customization Modal */}
        <ViewCustomizationModal
          isOpen={isCustomizationModalOpen}
          onClose={() => setIsCustomizationModalOpen(false)}
          viewOptions={viewOptions}
          onSave={handleViewOptionsChange}
        />
      </div>
    </TooltipProvider>
  );
};
