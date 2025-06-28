
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const promptData = [
  { id: 1, prompt: "Generate a product description for wireless headphones", category: "Product", tokens: 245, responseTime: "1.2s", sentiment: "Positive", effectiveness: 92 },
  { id: 2, prompt: "Create a marketing email for summer sale", category: "Marketing", tokens: 189, responseTime: "0.8s", sentiment: "Positive", effectiveness: 87 },
  { id: 3, prompt: "Write a customer support response for refund request", category: "Support", tokens: 156, responseTime: "1.5s", sentiment: "Neutral", effectiveness: 78 },
  { id: 4, prompt: "Develop a sales pitch for enterprise software", category: "Sales", tokens: 298, responseTime: "2.1s", sentiment: "Positive", effectiveness: 95 },
  { id: 5, prompt: "Generate FAQ content for new product launch", category: "Product", tokens: 445, responseTime: "2.8s", sentiment: "Positive", effectiveness: 89 },
  { id: 6, prompt: "Create social media post for brand awareness", category: "Marketing", tokens: 87, responseTime: "0.5s", sentiment: "Positive", effectiveness: 91 },
  { id: 7, prompt: "Write technical documentation for API", category: "Technical", tokens: 567, responseTime: "3.2s", sentiment: "Neutral", effectiveness: 85 },
  { id: 8, prompt: "Generate personalized recommendation email", category: "Marketing", tokens: 234, responseTime: "1.4s", sentiment: "Positive", effectiveness: 93 },
];

const sentimentData = [
  { name: 'Positive', value: 68, color: '#22c55e' },
  { name: 'Neutral', value: 25, color: '#eab308' },
  { name: 'Negative', value: 7, color: '#ef4444' },
];

const effectivenessData = [
  { category: 'Product', effectiveness: 88 },
  { category: 'Marketing', effectiveness: 92 },
  { category: 'Support', effectiveness: 85 },
  { category: 'Sales', effectiveness: 90 },
  { category: 'Technical', effectiveness: 87 },
];

const timelineData = [
  { time: '00:00', prompts: 45 },
  { time: '04:00', prompts: 23 },
  { time: '08:00', prompts: 156 },
  { time: '12:00', prompts: 234 },
  { time: '16:00', prompts: 189 },
  { time: '20:00', prompts: 98 },
];

export function PromptAnalysisTab() {
  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Effectiveness by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={effectivenessData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="category" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="effectiveness" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="prompts" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prompts Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Prompts</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search prompts..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <div className="sticky top-0 bg-background z-10 border-b">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead className="min-w-[300px]">Prompt</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Effectiveness</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableBody>
                  {promptData.map((prompt) => (
                    <TableRow key={prompt.id}>
                      <TableCell className="font-medium">{prompt.id}</TableCell>
                      <TableCell className="min-w-[300px]">
                        <div className="max-w-[300px] truncate" title={prompt.prompt}>
                          {prompt.prompt}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{prompt.category}</Badge>
                      </TableCell>
                      <TableCell>{prompt.tokens}</TableCell>
                      <TableCell>{prompt.responseTime}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={prompt.sentiment === 'Positive' ? 'default' : prompt.sentiment === 'Neutral' ? 'secondary' : 'destructive'}
                        >
                          {prompt.sentiment}
                        </Badge>
                      </TableCell>
                      <TableCell>{prompt.effectiveness}%</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
