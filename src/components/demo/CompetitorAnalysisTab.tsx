
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Star, Zap } from 'lucide-react';
import { competitorData } from '@/data/demoData';
import { renderPresenceRank } from '@/utils/demoUtils';

export const CompetitorAnalysisTab: React.FC = () => {
  const radarData = competitorData.map(comp => ({
    company: comp.company,
    marketShare: comp.marketShare,
    growth: comp.growth,
    satisfaction: comp.satisfaction * 20, // Scale to 100
    features: comp.features
  }));

  const renderCompetitorCard = (competitor: any, index: number) => (
    <Card key={index} className={competitor.company === 'Our Product' ? 'border-blue-500 bg-blue-50' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {competitor.company}
            {competitor.company === 'Our Product' && <Badge>You</Badge>}
          </CardTitle>
          {renderPresenceRank(index + 1)}
        </div>
        <CardDescription>{competitor.pricing}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              Market Share
            </div>
            <div className="text-2xl font-bold">{competitor.marketShare}%</div>
            <Progress value={competitor.marketShare} className="h-2 mt-1" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Growth Rate
            </div>
            <div className="text-2xl font-bold text-green-600">+{competitor.growth}%</div>
            <Progress value={competitor.growth * 4} className="h-2 mt-1" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Star className="h-4 w-4" />
              Satisfaction
            </div>
            <div className="text-2xl font-bold">{competitor.satisfaction}/5</div>
            <Progress value={competitor.satisfaction * 20} className="h-2 mt-1" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Zap className="h-4 w-4" />
              Features
            </div>
            <div className="text-2xl font-bold">{competitor.features}%</div>
            <Progress value={competitor.features} className="h-2 mt-1" />
          </div>
        </div>

        <div>
          <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
          <div className="flex flex-wrap gap-1">
            {competitor.strengths.map((strength: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {strength}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-red-600 mb-2">Weaknesses</h4>
          <div className="flex flex-wrap gap-1">
            {competitor.weaknesses.map((weakness: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                {weakness}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitorData.map(renderCompetitorCard)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Share Comparison</CardTitle>
            <CardDescription>Current market position analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={competitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="marketShare" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competitive Radar</CardTitle>
            <CardDescription>Multi-dimensional performance comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="company" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Market Share" dataKey="marketShare" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} />
                <Radar name="Growth" dataKey="growth" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} />
                <Radar name="Satisfaction" dataKey="satisfaction" stroke="#ffc658" fill="#ffc658" fillOpacity={0.1} />
                <Radar name="Features" dataKey="features" stroke="#ff7300" fill="#ff7300" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competitive Intelligence Summary</CardTitle>
          <CardDescription>Key insights and strategic recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Market Opportunities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <span>Highest growth rate in the market (+25% vs industry average of 12%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <span>Superior feature set (92% vs competitors' 78-85%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <span>Best-in-class user satisfaction (4.5/5)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Areas for Improvement</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <span>Market share opportunity - currently 3rd position</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <span>Brand awareness and market presence need expansion</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <span>Competitive pricing strategy vs market leaders</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
