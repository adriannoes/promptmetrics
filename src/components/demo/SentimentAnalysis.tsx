

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, AlertTriangle, Target, CheckCircle, XCircle } from 'lucide-react';
import { overallSentimentData, llmSentimentData } from '@/constants/PromptAnalysisData';

export const SentimentAnalysis = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-blue-600" />
          Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Overall Sentiment Score and Sentiment by LLM */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Overall Sentiment Score</h3>
              <ResponsiveContainer width="100%" height={200}>
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
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Sentiment by LLM</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>LLM</TableHead>
                    <TableHead>Lovable</TableHead>
                    <TableHead>Bolt</TableHead>
                    <TableHead>V0</TableHead>
                    <TableHead>Figma Make</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {llmSentimentData.map((row) => (
                    <TableRow key={row.llm}>
                      <TableCell className="font-medium">{row.llm}</TableCell>
                      <TableCell>{row.lovable}</TableCell>
                      <TableCell>{row.bolt}</TableCell>
                      <TableCell>{row.v0}</TableCell>
                      <TableCell>{row.figmaMake}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Critical Prompts and Actionable Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Critical Prompts (Negative Sentiment)
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">"enterprise development tools"</h4>
                    <Badge variant="destructive">-15</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Limited enterprise features compared to competitors</p>
                  <p className="text-xs text-gray-500">89 mentions | Sentiment: -15</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">"team collaboration platforms"</h4>
                    <Badge variant="destructive">-8</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Weak team collaboration tools</p>
                  <p className="text-xs text-gray-500">67 mentions | Sentiment: -8</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">"scalable web development"</h4>
                    <Badge variant="secondary">-12</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Scalability concerns for large projects</p>
                  <p className="text-xs text-gray-500">45 mentions | Sentiment: -12</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                Actionable Sentiment Insights
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-blue-600 mb-2">Immediate Actions</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                      Address enterprise features gap - highest negative sentiment driver
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                      Improve team collaboration tools to match competitor offerings
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                      Leverage AI-powered development strength in marketing content
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Strategic Opportunities</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
                      Claude shows highest sentiment (85) - focus partnership efforts
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
                      Rapid prototyping strength underutilized in messaging
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Strengths & Drawbacks */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sentiment Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="flex items-center gap-2 font-medium text-green-600 mb-3">
                  <CheckCircle className="w-4 h-4" />
                  Top Sentiment Strengths
                </h4>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">AI-Powered Development</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">+92</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Users consistently praise Lovable's intelligent code generation and AI assistance</p>
                    <p className="text-xs text-gray-500">234 positive mentions</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Visual Programming Interface</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">+88</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Real-time visual feedback and intuitive design tools receive high praise</p>
                    <p className="text-xs text-gray-500">189 positive mentions</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="flex items-center gap-2 font-medium text-red-600 mb-3">
                  <XCircle className="w-4 h-4" />
                  Key Sentiment Drawbacks
                </h4>
                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Enterprise Features</span>
                      <Badge variant="destructive">-18</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Lack of advanced enterprise security, compliance, and management features</p>
                    <p className="text-xs text-gray-500">156 negative mentions</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Team Collaboration</span>
                      <Badge variant="destructive">-15</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Limited real-time collaboration tools for development teams</p>
                    <p className="text-xs text-gray-500">123 negative mentions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
