import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Brain, 
  Target, 
  Clock, 
  CheckCircle,
  Info
} from 'lucide-react';

interface ModelInfo {
  name: string;
  type: 'pointwise' | 'pairwise' | 'listwise';
  size: string;
  description: string;
  recommended_for: string[];
  memory_requirement: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
  models?: ModelInfo[];
}

const defaultModels: ModelInfo[] = [
  {
    name: 'monot5',
    type: 'pointwise',
    size: '3B',
    description: 'Pointwise reranker - good for general purpose',
    recommended_for: ['general', 'efficiency'],
    memory_requirement: '6GB'
  },
  {
    name: 'zephyr',
    type: 'listwise',
    size: '7B',
    description: 'Listwise reranker - state-of-the-art performance',
    recommended_for: ['accuracy', 'research'],
    memory_requirement: '14GB'
  },
  {
    name: 'vicuna',
    type: 'listwise',
    size: '7B',
    description: 'Listwise reranker - good balance',
    recommended_for: ['balanced', 'research'],
    memory_requirement: '14GB'
  },
  {
    name: 'duot5',
    type: 'pairwise',
    size: '3B',
    description: 'Pairwise reranker - good for precision',
    recommended_for: ['precision', 'small_datasets'],
    memory_requirement: '6GB'
  }
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  onModelSelect,
  models = defaultModels 
}) => {
  const getModelIcon = (type: string) => {
    switch (type) {
      case 'pointwise':
        return <Target className="w-4 h-4" />;
      case 'pairwise':
        return <Brain className="w-4 h-4" />;
      case 'listwise':
        return <Zap className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getModelColor = (type: string) => {
    switch (type) {
      case 'pointwise':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pairwise':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'listwise':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendedBadge = (recommended_for: string[]) => {
    if (recommended_for.includes('efficiency')) {
      return <Badge variant="secondary" className="text-xs">⚡ Fast</Badge>;
    }
    if (recommended_for.includes('accuracy')) {
      return <Badge variant="secondary" className="text-xs">🎯 Accurate</Badge>;
    }
    if (recommended_for.includes('precision')) {
      return <Badge variant="secondary" className="text-xs">🎯 Precise</Badge>;
    }
    return <Badge variant="outline" className="text-xs">⚖️ Balanced</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Select Ranking Model
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose the best model for your use case. Each model has different strengths and resource requirements.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((model) => (
            <Card 
              key={model.name}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedModel === model.name 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onModelSelect(model.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getModelIcon(model.type)}
                    <div>
                      <h3 className="font-semibold capitalize">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">{model.size} parameters</p>
                    </div>
                  </div>
                  {selectedModel === model.name && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {model.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Type:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getModelColor(model.type)}`}
                    >
                      {model.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Memory:</span>
                    <span className="text-xs font-medium">{model.memory_requirement}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Speed:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {model.memory_requirement === '6GB' ? 'Fast' : 'Slower'}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Recommended for:</span>
                    {getRecommendedBadge(model.recommended_for)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Model Selection Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>MonoT5:</strong> Best for general use, fast processing</li>
                <li>• <strong>RankZephyr:</strong> Highest accuracy, requires more resources</li>
                <li>• <strong>RankVicuna:</strong> Good balance of speed and accuracy</li>
                <li>• <strong>DuoT5:</strong> Best for precision tasks with small datasets</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
