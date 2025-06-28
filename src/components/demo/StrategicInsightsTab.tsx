
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Users, Zap, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

const performanceMetrics = [
  { metric: 'User Engagement', current: 78, target: 85, trend: 'up' },
  { metric: 'Response Quality', current: 92, target: 95, trend: 'up' },
  { metric: 'Processing Speed', current: 87, target: 90, trend: 'down' },
  { metric: 'Cost Efficiency', current: 94, target: 90, trend: 'up' },
];

const categoryPerformance = [
  { category: 'Marketing', performance: 92, volume: 1200, growth: 15 },
  { category: 'Support', performance: 88, volume: 800, growth: 8 },
  { category: 'Sales', performance: 95, volume: 600, growth: 22 },
  { category: 'Product', performance: 90, volume: 1000, growth: 12 },
];

const competitiveAnalysis = [
  { subject: 'Response Speed', A: 120, B: 110, fullMark: 150 },
  { subject: 'Accuracy', A: 98, B: 85, fullMark: 150 },
  { subject: 'Cost', A: 86, B: 95, fullMark: 150 },
  { subject: 'Features', A: 99, B: 85, fullMark: 150 },
  { subject: 'Support', A: 85, B: 90, fullMark: 150 },
  { subject: 'Scalability', A: 95, B: 80, fullMark: 150 },
];

const projectionData = [
  { month: 'Jan', current: 1200, projected: 1250 },
  { month: 'Feb', current: 1400, projected: 1480 },
  { month: 'Mar', current: 1300, projected: 1420 },
  { month: 'Apr', current: 1600, projected: 1720 },
  { month: 'May', current: 1800, projected: 1950 },
  { month: 'Jun', current: null, projected: 2100 },
];

export function StrategicInsightsTab() {
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
              {metric.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.current}%</div>
              <div className="mt-2">
                <Progress value={metric.current} className="w-full" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Target: {metric.target}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance Analysis</CardTitle>
            <CardDescription>Performance metrics across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryPerformance.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.category}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{category.volume} prompts</Badge>
                      <Badge variant={category.growth > 15 ? "default" : "secondary"}>
                        +{category.growth}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={category.performance} className="w-full" />
                  <div className="text-xs text-muted-foreground">
                    Performance: {category.performance}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competitive Analysis</CardTitle>
            <CardDescription>Performance comparison with competitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={competitiveAnalysis}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Our Platform" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Competitor" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Growth Projections</CardTitle>
            <CardDescription>6-month usage forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="current" stroke="#8884d8" strokeWidth={2} name="Current" />
                  <Line type="monotone" dataKey="projected" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" name="Projected" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategic Recommendations</CardTitle>
            <CardDescription>AI-powered insights and suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Target className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-sm">Optimize Marketing Prompts</h4>
                  <p className="text-sm text-muted-foreground">Marketing category shows highest growth potential. Consider expanding prompt templates.</p>
                  <Badge className="mt-2" variant="outline">High Priority</Badge>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Users className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-sm">Enhance User Engagement</h4>
                  <p className="text-sm text-muted-foreground">User engagement is 7% below target. Implement personalization features.</p>
                  <Badge className="mt-2" variant="outline">Medium Priority</Badge>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Zap className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-medium text-sm">Improve Processing Speed</h4>
                  <p className="text-sm text-muted-foreground">Response times can be optimized by 15% through infrastructure improvements.</p>
                  <Badge className="mt-2" variant="outline">Low Priority</Badge>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Award className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-medium text-sm">Leverage Cost Efficiency</h4>
                  <p className="text-sm text-muted-foreground">Your cost efficiency leads the market. Use this as a competitive advantage.</p>
                  <Badge className="mt-2" variant="outline">Opportunity</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
