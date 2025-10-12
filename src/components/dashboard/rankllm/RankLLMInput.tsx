import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FileText, Search } from 'lucide-react';
import { RankLLMRequest, Document } from '@/types/rankllm';

interface RankLLMInputProps {
  onSubmit: (request: RankLLMRequest) => void;
  loading?: boolean;
  domain: string;
}

export const RankLLMInput: React.FC<RankLLMInputProps> = ({ 
  onSubmit, 
  loading = false, 
  domain 
}) => {
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'doc1', content: '', title: '' }
  ]);
  const [model, setModel] = useState('monot5');
  const [topK, setTopK] = useState<number | undefined>(undefined);

  const addDocument = () => {
    const newDoc: Document = {
      id: `doc${documents.length + 1}`,
      content: '',
      title: ''
    };
    setDocuments([...documents, newDoc]);
  };

  const removeDocument = (index: number) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  const updateDocument = (index: number, field: keyof Document, value: string) => {
    const updated = documents.map((doc, i) => 
      i === index ? { ...doc, [field]: value } : doc
    );
    setDocuments(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    const validDocuments = documents.filter(doc => doc.content.trim());
    if (validDocuments.length === 0) {
      alert('Please add at least one document with content');
      return;
    }

    onSubmit({
      query: query.trim(),
      documents: validDocuments,
      model: model as any,
      top_k: topK,
      domain
    });
  };

  const isFormValid = query.trim() && documents.some(doc => doc.content.trim());

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Document Ranking with RankLLM
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter a search query and documents to rank using advanced LLM-based reranking
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="query">Search Query</Label>
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query..."
              required
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Ranking Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monot5">
                  <div className="flex flex-col">
                    <span>MonoT5</span>
                    <span className="text-xs text-muted-foreground">Pointwise - Fast & Efficient</span>
                  </div>
                </SelectItem>
                <SelectItem value="zephyr">
                  <div className="flex flex-col">
                    <span>RankZephyr</span>
                    <span className="text-xs text-muted-foreground">Listwise - State-of-the-art</span>
                  </div>
                </SelectItem>
                <SelectItem value="vicuna">
                  <div className="flex flex-col">
                    <span>RankVicuna</span>
                    <span className="text-xs text-muted-foreground">Listwise - Balanced</span>
                  </div>
                </SelectItem>
                <SelectItem value="duot5">
                  <div className="flex flex-col">
                    <span>DuoT5</span>
                    <span className="text-xs text-muted-foreground">Pairwise - High Precision</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Top K Results */}
          <div className="space-y-2">
            <Label htmlFor="topK">Top K Results (optional)</Label>
            <Input
              id="topK"
              type="number"
              value={topK || ''}
              onChange={(e) => setTopK(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Number of top results to return"
              min="1"
              max="100"
            />
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Documents to Rank</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDocument}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Document
              </Button>
            </div>

            <div className="space-y-3">
              {documents.map((doc, index) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">Document {index + 1}</span>
                    </div>
                    {documents.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`title-${index}`}>Title (optional)</Label>
                      <Input
                        id={`title-${index}`}
                        value={doc.title || ''}
                        onChange={(e) => updateDocument(index, 'title', e.target.value)}
                        placeholder="Document title..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`content-${index}`}>Content *</Label>
                      <Textarea
                        id={`content-${index}`}
                        value={doc.content}
                        onChange={(e) => updateDocument(index, 'content', e.target.value)}
                        placeholder="Enter document content..."
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Domain: {domain}</Badge>
              <Badge variant="secondary">Model: {model}</Badge>
            </div>
            
            <Button 
              type="submit" 
              disabled={!isFormValid || loading}
              className="min-w-[120px]"
            >
              {loading ? 'Ranking...' : 'Start Ranking'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
