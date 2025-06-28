import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const SENTIMENT_COLORS = ["#10b981", "#6b7280", "#ef4444"];

const prompts = [
  {
    id: "1",
    text: "Write a blog post about the benefits of using our product for small businesses.",
    category: "Blog Post",
    frequency: 32,
    avgRating: 4.5,
    lastUsed: "2024-03-15",
  },
  {
    id: "2",
    text: "Create a tweet announcing our new partnership with a leading industry expert.",
    category: "Social Media",
    frequency: 45,
    avgRating: 4.8,
    lastUsed: "2024-03-20",
  },
  {
    id: "3",
    text: "Draft an email to our subscribers about the upcoming webinar on digital marketing trends.",
    category: "Email Marketing",
    frequency: 27,
    avgRating: 4.2,
    lastUsed: "2024-03-10",
  },
  {
    id: "4",
    text: "Generate ad copy for our latest product launch campaign on Google Ads.",
    category: "Advertising",
    frequency: 51,
    avgRating: 4.9,
    lastUsed: "2024-03-25",
  },
  {
    id: "5",
    text: "Develop a script for a video testimonial featuring one of our satisfied customers.",
    category: "Video Marketing",
    frequency: 19,
    avgRating: 4.0,
    lastUsed: "2024-03-05",
  },
  {
    id: "6",
    text: "Write a blog post about the benefits of using our product for small businesses.",
    category: "Blog Post",
    frequency: 32,
    avgRating: 4.5,
    lastUsed: "2024-03-15",
  },
  {
    id: "7",
    text: "Create a tweet announcing our new partnership with a leading industry expert.",
    category: "Social Media",
    frequency: 45,
    avgRating: 4.8,
    lastUsed: "2024-03-20",
  },
  {
    id: "8",
    text: "Draft an email to our subscribers about the upcoming webinar on digital marketing trends.",
    category: "Email Marketing",
    frequency: 27,
    avgRating: 4.2,
    lastUsed: "2024-03-10",
  },
  {
    id: "9",
    text: "Generate ad copy for our latest product launch campaign on Google Ads.",
    category: "Advertising",
    frequency: 51,
    avgRating: 4.9,
    lastUsed: "2024-03-25",
  },
  {
    id: "10",
    text: "Develop a script for a video testimonial featuring one of our satisfied customers.",
    category: "Video Marketing",
    frequency: 19,
    avgRating: 4.0,
    lastUsed: "2024-03-05",
  },
];

const performanceData = [
  { name: "Jan", impressions: 4000, clicks: 2400, cost: 800 },
  { name: "Feb", impressions: 3000, clicks: 1398, cost: 600 },
  { name: "Mar", impressions: 2000, clicks: 9800, cost: 400 },
  { name: "Apr", impressions: 2780, clicks: 3908, cost: 700 },
  { name: "May", impressions: 1890, clicks: 4800, cost: 500 },
  { name: "Jun", impressions: 2390, clicks: 3800, cost: 550 },
  { name: "Jul", impressions: 3490, clicks: 4300, cost: 900 },
];

const sentimentData = [
  { name: "Positive", value: 400 },
  { name: "Neutral", value: 300 },
  { name: "Negative", value: 300 },
];

const sentimentTrend = [
  { date: "Jan", positive: 40, neutral: 30, negative: 30 },
  { date: "Feb", positive: 50, neutral: 20, negative: 30 },
  { date: "Mar", positive: 45, neutral: 35, negative: 20 },
  { date: "Apr", positive: 60, neutral: 15, negative: 25 },
  { date: "May", positive: 55, neutral: 25, negative: 20 },
];

export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <header className="bg-white border-b">
        <div className="container flex h-16 items-center justify-between">
          <a className="flex items-center gap-2 text-2xl font-semibold" href="#">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 8.10005L13.1 16.9C12.9 17.1 12.6 17.2 12.3 17.2H12.3C12 17.2 11.7 17.1 11.5 16.9L3.60005 8.10005C3.20005 7.60005 3.40005 6.90005 3.90005 6.60005C4.40005 6.20005 5.10005 6.40005 5.40005 6.90005L12.3 14.8L18.5 7.60005C18.8 7.20005 19.4 7.10005 19.9 7.40005C20.4 7.70005 20.6 8.40005 21 8.10005Z"
                fill="currentColor"
              />
            </svg>
            <span>Brand</span>
          </a>
          <nav className="flex items-center gap-6">
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Home
            </a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
              About
            </a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Services
            </a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
            <TabsTrigger value="strategic-insights">Strategic Insights</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Performance</CardTitle>
                <CardDescription>Overview of key metrics for your website.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressions" />
                    <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                    <Line type="monotone" dataKey="cost" stroke="#ffc658" name="Cost" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Impressions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">12,459</div>
                  <p className="text-muted-foreground">Compared to 9,876 last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">4,567</div>
                  <p className="text-muted-foreground">Compared to 3,987 last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">$3,456</div>
                  <p className="text-muted-foreground">Compared to $2,987 last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prompt-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Metrics</CardTitle>
                <CardDescription>Key metrics related to prompt usage and performance.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Prompts Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">345</div>
                    <p className="text-muted-foreground">Since last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Most Frequent Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">Social Media</div>
                    <p className="text-muted-foreground">Based on prompt category</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        4.6
                      </div>
                    </div>
                    <p className="text-muted-foreground">Average user rating for prompts</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Prompts Section */}
            <Card>
              <CardHeader>
                <CardTitle>Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative max-h-96 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead>Prompt</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Avg Rating</TableHead>
                        <TableHead>Last Used</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prompts.map((prompt) => (
                        <TableRow key={prompt.id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {prompt.text}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{prompt.category}</Badge>
                          </TableCell>
                          <TableCell>{prompt.frequency}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {prompt.avgRating}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {prompt.lastUsed}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Analysis Section */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Overall Sentiment Distribution</h4>
                    <ResponsiveContainer width="100%" height={200}>
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
                            <Cell
                              key={`cell-${index}`}
                              fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Sentiment Over Time</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={sentimentTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="positive" stroke="#10b981" name="Positive" />
                        <Line type="monotone" dataKey="neutral" stroke="#6b7280" name="Neutral" />
                        <Line type="monotone" dataKey="negative" stroke="#ef4444" name="Negative" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategic-insights">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Harness the power of data-driven insights to make informed strategic decisions.
                  This section provides a comprehensive analysis of market trends, customer
                  behavior, and competitive landscape.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitor-analysis">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Stay ahead of the competition with our in-depth competitor analysis tools.
                  Identify key players in your industry, assess their strengths and weaknesses, and
                  uncover opportunities for differentiation.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
