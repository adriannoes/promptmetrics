
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Star, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const competitorData = [
  {
    name: "AI Prompt Pro",
    marketShare: 35,
    rating: 4.2,
    pricing: "$29/month",
    strengths: ["Fast response", "Good UI"],
    weaknesses: ["Limited features", "High cost"],
    trend: "down"
  },
  {
    name: "PromptGenius",
    marketShare: 28,
    rating: 4.5,
    pricing: "$19/month",
    strengths: ["Feature rich", "Good support"],
    weaknesses: ["Slow processing", "Complex UI"],
    trend: "up"
  },
  {
    name: "QuickPrompt",
    marketShare: 15,
    rating: 3.8,
    pricing: "$15/month",
    strengths: ["Affordable", "Simple"],
    weaknesses: ["Basic features", "Poor accuracy"],
    trend: "down"
  },
  {
    name: "SmartPrompt AI",
    marketShare: 12,
    rating: 4.1,
    pricing: "$25/month",
    strengths: ["AI-powered", "Accurate"],
    weaknesses: ["Limited integrations", "New platform"],
    trend: "up"
  }
];

const featureComparison = [
  { feature: "Response Speed", us: 95, competitor1: 78, competitor2: 82, competitor3: 65 },
  { feature: "Accuracy", us: 92, competitor1: 85, competitor2: 88, competitor3: 70 },
  { feature: "Features", us: 88, competitor1: 82, competitor2: 90, competitor3: 60 },
  { feature: "Pricing", us: 85, competitor1: 65, competitor2: 78, competitor3: 90 },
  { feature: "Support", us: 90, competitor1: 88, competitor2: 85, competitor3: 72 },
  { feature: "Integrations", us: 87, competitor1: 75, competitor2: 80, competitor3: 55 },
];

const marketTrends = [
  { category: "AI-Powered Features", growth: 45, opportunity: "High" },
  { category: "API Integrations", growth: 38, opportunity: "Medium" },
  { category: "Custom Templates", growth: 28, opportunity: "Medium" },
  { category: "Real-time Analytics", growth: 52, opportunity: "High" },
  { category: "Multi-language Support", growth: 33, opportunity: "Low" },
];

const radarData = [
  { subject: 'Speed', A: 95, B: 78, C: 82, fullMark: 100 },
  { subject: 'Accuracy', A: 92, B: 85, C: 88, fullMark: 100 },
  { subject: 'Features', A: 88, B: 82, C: 90, fullMark: 100 },
  { subject: 'Pricing', A: 85, B: 65, C: 78, fullMark: 100 },
  { subject: 'Support', A: 90, B: 88, C: 85, fullMark: 100 },
];

export function CompetitorAnalysisTab() {
  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Position</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#2</div>
            <p className="text-xs text-muted-foreground">Rising to #1 position</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22%</div>
            <p className="text-xs text-muted-foreground">+5% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">Industry leading rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competitive Edge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Overall advantage score</p>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Competitive Landscape</CardTitle>
            <CardDescription>Key competitors and their market position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitorData.map((competitor, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{competitor.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{competitor.marketShare}% market share</Badge>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span className="text-sm">{competitor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{competitor.pricing}</div>
                      {competitor.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600 ml-auto" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 ml-auto" />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs font-medium text-green-600 mb-1">Strengths</p>
                      {competitor.strengths.map((strength, i) => (
                        <Badge key={i} variant="outline" className="mr-1 mb-1 text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-red-600 mb-1">Weaknesses</p>
                      {competitor.weaknesses.map((weakness, i) => (
                        <Badge key={i} variant="secondary" className="mr-1 mb-1 text-xs">
                          {weakness}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison Radar</CardTitle>
            <CardDescription>Multi-dimensional competitive analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Our Platform" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Competitor 1" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="Competitor 2" dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Feature Comparison</CardTitle>
          <CardDescription>Head-to-head feature analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Our Platform</TableHead>
                <TableHead>AI Prompt Pro</TableHead>
                <TableHead>PromptGenius</TableHead>
                <TableHead>QuickPrompt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureComparison.map((feature, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{feature.feature}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={feature.us} className="w-16" />
                      <span className="text-sm font-medium">{feature.us}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={feature.competitor1} className="w-16" />
                      <span className="text-sm">{feature.competitor1}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={feature.competitor2} className="w-16" />
                      <span className="text-sm">{feature.competitor2}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={feature.competitor3} className="w-16" />
                      <span className="text-sm">{feature.competitor3}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Market Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Market Opportunities</CardTitle>
          <CardDescription>Emerging trends and growth opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketTrends.map((trend, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm">{trend.category}</h3>
                  <Badge variant={trend.opportunity === 'High' ? 'default' : trend.opportunity === 'Medium' ? 'secondary' : 'outline'}>
                    {trend.opportunity}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold">{trend.growth}%</span>
                  <span className="text-sm text-muted-foreground">growth</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Analyze Opportunity
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
