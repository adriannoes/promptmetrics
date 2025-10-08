

import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Target, TrendingUp, Heart } from 'lucide-react';
import { flashCardData } from '@/constants/PromptAnalysisData';

const iconMap = {
  BarChart3,
  Target,
  TrendingUp,
  Heart,
};

export const PromptFlashCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {flashCardData.map((card) => {
        const IconComponent = iconMap[card.icon as keyof typeof iconMap];
        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <p className="text-sm text-gray-600">{card.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
