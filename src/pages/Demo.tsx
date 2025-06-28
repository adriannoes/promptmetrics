import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, MessageSquare, Target, Zap, Globe, Heart, Star, ThumbsUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const promptData = [
  {
    name: "Generate a landing page for a SaaS product",
    llm: "GPT-4",
    lovable: { present: true, rank: 1 },
    bolt: { present: false, rank: 3 },
    v0: { present: true, rank: 2 },
    figma: { present: false, rank: 4 },
  },
  {
    name: "Create a mobile app UI for a fitness tracker",
    llm: "Gemini",
    lovable: { present: false, rank: 2 },
    bolt: { present: true, rank: 1 },
    v0: { present: false, rank: 3 },
    figma: { present: true, rank: 4 },
  },
  {
    name: "Design a dashboard for a data analytics platform",
    llm: "GPT-4",
    lovable: { present: true, rank: 3 },
    bolt: { present: false, rank: 4 },
    v0: { present: true, rank: 1 },
    figma: { present: false, rank: 2 },
  },
  {
    name: "Develop an e-commerce website layout",
    llm: "Gemini",
    lovable: { present: false, rank: 4 },
    bolt: { present: true, rank: 2 },
    v0: { present: false, rank: 1 },
    figma: { present: true, rank: 3 },
  },
];

const Demo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights and analytics</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
            <TabsTrigger value="strategic-insights">Strategic Insights</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Total Revenue
                  </CardTitle>
                  <CardDescription>Over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <Progress value={70} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">70% increase compared to last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    New Customers
                  </CardTitle>
                  <CardDescription>Over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,254</div>
                  <Progress value={45} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">45% new customer acquisition rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-500" />
                    Conversion Rate
                  </CardTitle>
                  <CardDescription>For product X</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.8%</div>
                  <Progress value={13} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">13% improvement in conversion rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Website Traffic
                </CardTitle>
                <CardDescription>Daily traffic overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prompt Analysis Tab */}
          <TabsContent value="prompt-analysis" className="space-y-6">
            {/* Metrics Cards Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-sky-500" />
                    Global Reach
                  </CardTitle>
                  <CardDescription>Worldwide user engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78 Countries</div>
                  <p className="mt-2 text-sm text-gray-500">Active users from 78 different countries</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Customer Satisfaction
                  </CardTitle>
                  <CardDescription>Average satisfaction score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.7/5</div>
                  <Progress value={94} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">Based on 2,500+ reviews</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-500" />
                    Feature Adoption
                  </CardTitle>
                  <CardDescription>Adoption rate of new features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">65%</div>
                  <Progress value={65} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">65% of users are actively using new features</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-emerald-500" />
                    Positive Feedback
                  </CardTitle>
                  <CardDescription>Positive feedback ratio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                  <Progress value={89} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">89% of feedback is positive</p>
                </CardContent>
              </Card>
            </div>

            {/* Prompts Section - with sticky header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Prompts
                </CardTitle>
                <CardDescription>
                  Analysis of prompt performance across different AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative max-h-96 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10 shadow-sm border-b">
                      <TableRow>
                        <TableHead className="bg-white">Prompt</TableHead>
                        <TableHead className="bg-white">LLM</TableHead>
                        <TableHead className="bg-white">Lovable<br />Present | Rank</TableHead>
                        <TableHead className="bg-white">Bolt<br />Present | Rank</TableHead>
                        <TableHead className="bg-white">V0<br />Present | Rank</TableHead>
                        <TableHead className="bg-white">Figma Make<br />Present | Rank</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promptData.map((prompt, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{prompt.name}</TableCell>
                          <TableCell>{prompt.llm}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={prompt.lovable.present ? "default" : "secondary"}>
                                {prompt.lovable.present ? "Yes" : "No"}
                              </Badge>
                              <span className="text-sm text-gray-500">{prompt.lovable.rank}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={prompt.bolt.present ? "default" : "secondary"}>
                                {prompt.bolt.present ? "Yes" : "No"}
                              </Badge>
                              <span className="text-sm text-gray-500">{prompt.bolt.rank}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={prompt.v0.present ? "default" : "secondary"}>
                                {prompt.v0.present ? "Yes" : "No"}
                              </Badge>
                              <span className="text-sm text-gray-500">{prompt.v0.rank}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={prompt.figma.present ? "default" : "secondary"}>
                                {prompt.figma.present ? "Yes" : "No"}
                              </Badge>
                              <span className="text-sm text-gray-500">{prompt.figma.rank}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Product Sentiment Analysis Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Product Sentiment Analysis
                </CardTitle>
                <CardDescription>
                  Understanding user sentiment and feedback patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sentiment Analysis Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sentiment Distribution</CardTitle>
                      <CardDescription>Distribution of sentiment across user feedback</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="pv" fill="#8884d8" />
                          <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sentiment Breakdown</CardTitle>
                      <CardDescription>Breakdown of sentiment categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="uv"
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategic Insights Tab */}
          <TabsContent value="strategic-insights" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Market Growth
                  </CardTitle>
                  <CardDescription>Year-over-year market growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15.5%</div>
                  <Progress value={55} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">15.5% increase in market size</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    User Engagement
                  </CardTitle>
                  <CardDescription>Active users per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3M</div>
                  <Progress value={80} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">2.3 million active users per month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-500" />
                    Customer Retention
                  </CardTitle>
                  <CardDescription>Customer retention rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <Progress value={78} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">78% customer retention rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Sales Performance
                </CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitor Analysis Tab */}
          <TabsContent value="competitor-analysis" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    Competitor A Market Share
                  </CardTitle>
                  <CardDescription>Market share of Competitor A</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22%</div>
                  <Progress value={22} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">22% market share</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Competitor B Growth Rate
                  </CardTitle>
                  <CardDescription>Growth rate of Competitor B</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18%</div>
                  <Progress value={60} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">18% growth rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Competitor C User Base
                  </CardTitle>
                  <CardDescription>User base of Competitor C</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.5M</div>
                  <Progress value={50} className="mt-4" />
                  <p className="mt-2 text-sm text-gray-500">1.5 million users</p>
                </CardContent>
              </Card>
            </div>

            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Competitor Performance
                </CardTitle>
                <CardDescription>Comparison of competitor performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Demo;
