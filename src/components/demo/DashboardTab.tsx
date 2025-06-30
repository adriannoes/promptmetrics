
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Heart, Trophy } from 'lucide-react';

const sentimentTrendData = [
  { month: 'Jan', Lovable: 75, Bolt: 68, V0: 65, 'Figma Make': 58 },
  { month: 'Feb', Lovable: 76, Bolt: 69, V0: 66, 'Figma Make': 59 },
  { month: 'Mar', Lovable: 78, Bolt: 70, V0: 68, 'Figma Make': 59 },
  { month: 'Apr', Lovable: 77, Bolt: 71, V0: 68, 'Figma Make': 59 },
  { month: 'May', Lovable: 79, Bolt: 70, V0: 68, 'Figma Make': 60 },
  { month: 'Jun', Lovable: 78, Bolt: 71, V0: 68, 'Figma Make': 59 },
];

const rankingData = [
  { month: 'Jan', Lovable: 2.1, Bolt: 2.8, V0: 3.2, 'Figma Make': 3.8 },
  { month: 'Feb', Lovable: 2.0, Bolt: 2.7, V0: 3.1, 'Figma Make': 3.9 },
  { month: 'Mar', Lovable: 1.9, Bolt: 2.6, V0: 3.0, 'Figma Make': 4.0 },
  { month: 'Apr', Lovable: 2.0, Bolt: 2.5, V0: 2.9, 'Figma Make': 4.1 },
  { month: 'May', Lovable: 1.8, Bolt: 2.4, V0: 2.8, 'Figma Make': 4.2 },
  { month: 'Jun', Lovable: 1.7, Bolt: 2.3, V0: 2.7, 'Figma Make': 4.3 },
];

const overallSentimentData = [
  { name: 'Lovable', score: 77.6, color: '#3B82F6' },
  { name: 'Bolt', score: 73.4, color: '#10B981' },
  { name: 'V0', score: 68.8, color: '#8B5CF6' },
  { name: 'Figma Make', score: 59.6, color: '#F59E0B' },
];

const shareOfRankData = [
  { month: 'Jan', Lovable: 35, Bolt: 28, V0: 22, 'Figma Make': 15 },
  { month: 'Feb', Lovable: 38, Bolt: 26, V0: 21, 'Figma Make': 15 },
  { month: 'Mar', Lovable: 42, Bolt: 25, V0: 20, 'Figma Make': 13 },
  { month: 'Apr', Lovable: 45, Bolt: 24, V0: 19, 'Figma Make': 12 },
  { month: 'May', Lovable: 48, Bolt: 23, V0: 18, 'Figma Make': 11 },
  { month: 'Jun', Lovable: 52, Bolt: 22, V0: 17, 'Figma Make': 9 },
];

export const DashboardTab = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Average Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Average Ranking Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rankingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Lovable" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="Bolt" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="V0" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="Figma Make" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Share of #1 Rank */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Share of #1 Rank per Competitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={shareOfRankData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 60]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Lovable" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="Bolt" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="V0" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="Figma Make" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Sentiment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Sentiment Trends (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 85]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Lovable" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="Bolt" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="V0" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="Figma Make" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Sentiment Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              Overall Sentiment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overallSentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {overallSentimentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
};
