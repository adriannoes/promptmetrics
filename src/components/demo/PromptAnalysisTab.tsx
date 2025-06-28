
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, Settings, RefreshCw } from 'lucide-react';
import { mockPrompts } from '@/data/demoData';
import { FilterState, CustomizationOptions } from '@/types/demo';
import { filterPrompts, generateTableRows, getTableHeaders, getUniqueValues } from '@/utils/demoUtils';

interface PromptAnalysisTabProps {
  filters: FilterState;
  customization: CustomizationOptions;
  updateFilter: (key: keyof FilterState, value: string | undefined) => void;
  updateCustomization: (key: keyof CustomizationOptions, value: boolean) => void;
  resetFilters: () => void;
}

export const PromptAnalysisTab: React.FC<PromptAnalysisTabProps> = ({
  filters,
  customization,
  updateFilter,
  updateCustomization,
  resetFilters
}) => {
  const filteredPrompts = filterPrompts(mockPrompts, filters);
  const tableHeaders = getTableHeaders(customization);
  const tableRows = generateTableRows(filteredPrompts, customization);

  const uniqueCategories = getUniqueValues(mockPrompts, 'category');
  const uniqueRegions = getUniqueValues(mockPrompts, 'region');
  const uniqueIndustries = getUniqueValues(mockPrompts, 'industry');

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    // Convert "all" back to undefined for the filter logic
    updateFilter(key, value === 'all' ? undefined : value);
  };

  return (
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

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            {filteredPrompts.length} of {mockPrompts.length} prompts
          </Badge>
          {Object.keys(filters).some(key => filters[key as keyof FilterState]) && (
            <Badge variant="outline">Filtered</Badge>
          )}
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt Analysis Results</CardTitle>
          <CardDescription>Detailed view of filtered prompts with customizable columns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-auto max-h-96">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableHead key={index} className="bg-background">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((row, rowIndex) => (
                  <TableRow 
                    key={rowIndex}
                    className={customization.highlightHighPriority && filteredPrompts[rowIndex]?.priority === 'High' ? 'bg-red-50' : ''}
                  >
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className={customization.compactView ? 'py-2' : ''}>
                        {typeof cell === 'string' ? cell : cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
