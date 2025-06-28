import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, MessageSquare, Users, Zap, Heart, ThumbsUp, ThumbsDown, Star, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock data arrays
const promptData = [
  { id: 1, text: 'Write a poem about the moon', user: 'User A', responseTime: 1.5, status: 'Success', sentiment: 'Positive', category: 'Creative' },
  { id: 2, text: 'Translate "Hello world" to French', user: 'User B', responseTime: 0.8, status: 'Success', sentiment: 'Neutral', category: 'Translation' },
  { id: 3, text: 'Summarize the plot of Hamlet', user: 'User C', responseTime: 2.1, status: 'Success', sentiment: 'Neutral', category: 'Summary' },
  { id: 4, text: 'Debug my JavaScript code', user: 'User D', responseTime: 3.2, status: 'Failed', sentiment: 'Negative', category: 'Code' },
  { id: 5, text: 'Explain quantum physics', user: 'User E', responseTime: 4.5, status: 'Success', sentiment: 'Neutral', category: 'Educational' },
  { id: 6, text: 'Write a poem about the moon', user: 'User A', responseTime: 1.5, status: 'Success', sentiment: 'Positive', category: 'Creative' },
  { id: 7, text: 'Translate "Hello world" to French', user: 'User B', responseTime: 0.8, status: 'Success', sentiment: 'Neutral', category: 'Translation' },
  { id: 8, text: 'Summarize the plot of Hamlet', user: 'User C', responseTime: 2.1, status: 'Success', sentiment: 'Neutral', category: 'Summary' },
  { id: 9, text: 'Debug my JavaScript code', user: 'User D', responseTime: 3.2, status: 'Failed', sentiment: 'Negative', category: 'Code' },
  { id: 10, text: 'Explain quantum physics', user: 'User E', responseTime: 4.5, status: 'Success', sentiment: 'Neutral', category: 'Educational' },
];

const categoryData = [
  { category: 'Creative', count: 25 },
  { category: 'Translation', count: 15 },
  { category: 'Summary', count: 30 },
  { category: 'Code', count: 20 },
  { category: 'Educational', count: 10 },
];

const responseTimeData = [
  { day: 'Day 1', responseTime: 1.2 },
  { day: 'Day 2', responseTime: 1.5 },
  { day: 'Day 3', responseTime: 0.9 },
  { day: 'Day 4', responseTime: 1.1 },
  { day: 'Day 5', responseTime: 1.3 },
  { day: 'Day 6', responseTime: 1.0 },
  { day: 'Day 7', responseTime: 1.2 },
];

const sentimentData = [
  { name: 'Positive', value: 75 },
  { name: 'Neutral', value: 15 },
  { name: 'Negative', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const userData = [
  { name: 'Active Users', value: 1200 },
  { name: 'New Users', value: 300 },
  { name: 'Returning Users', value: 900 },
];

const Demo = () => {
  const [selectedTab, setSelectedTab] = useState('prompt-analysis');

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Analytics Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive insights into user interactions, prompt performance, and sentiment analysis
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
          <TabsTrigger value="user-insights">User Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt-analysis" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground">
                  -0.3s from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7/10</div>
                <p className="text-xs text-muted-foreground">
                  +0.4 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Prompts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Prompts</CardTitle>
              <CardDescription>Recent prompt interactions and their performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>Prompt</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="max-h-96 overflow-y-auto">
                    {promptData.map((prompt) => (
                      <TableRow key={prompt.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          {prompt.text}
                        </TableCell>
                        <TableCell>{prompt.user}</TableCell>
                        <TableCell>{prompt.responseTime}s</TableCell>
                        <TableCell>
                          <Badge 
                            variant={prompt.status === 'Success' ? 'default' : 'destructive'}
                          >
                            {prompt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              prompt.sentiment === 'Positive' ? 'default' : 
                              prompt.sentiment === 'Negative' ? 'destructive' : 'secondary'
                            }
                          >
                            {prompt.sentiment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{prompt.category}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Categories</CardTitle>
                <CardDescription>Distribution of prompt types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average response times over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="responseTime" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>Overall sentiment distribution and detailed analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Sentiment Distribution</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Sentiment Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Positive Feedback</span>
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Negative Feedback</span>
                      </div>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Average Rating</span>
                      </div>
                      <span className="text-sm font-medium">4.6/5</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-insights" className="space-y-6">
          {/* User Insights Section */}
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Metrics related to user activity and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,200</div>
                    <p className="text-xs text-muted-foreground">
                      +15% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Users</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">300</div>
                    <p className="text-xs text-muted-foreground">
                      +22% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h4 className="text-sm font-medium mt-4">User Demographics</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics Section */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Key performance indicators for the AI system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0.8s</div>
                    <p className="text-xs text-muted-foreground">
                      -0.1s from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0.5%</div>
                    <p className="text-xs text-muted-foreground">
                      -0.2% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,500 req/min</div>
                    <p className="text-xs text-muted-foreground">
                      +10% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h4 className="text-sm font-medium mt-4">Latency Trends</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="responseTime" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Demo;
