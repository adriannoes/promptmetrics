import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyRankDashboardTab } from '@/components/myrank/MyRankDashboardTab';
import { MyRankPromptAnalysisTab } from '@/components/myrank/MyRankPromptAnalysisTab';
import { MyRankCompetitorAnalysisTab } from '@/components/myrank/MyRankCompetitorAnalysisTab';
import { MyRankStrategicInsightsTab } from '@/components/myrank/MyRankStrategicInsightsTab';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';

// Dados mockados expandidos para Airbnb - análise completa de 12 meses
const analysisData = {
  id: 'airbnb-001',
  domain: 'www.airbnb.com',
  status: "completed" as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  analysis_data: {
    score: 92,
    summary: 'Airbnb is consistently recognized by AI systems as the global leader in short-term rentals and unique travel experiences. Analysis of 50+ AI models shows strong brand association with trust, innovation, and authentic local experiences. The platform demonstrates exceptional performance in accommodation diversity, user experience, and global reach. Recent AI responses highlight Airbnb\'s successful adaptation to post-pandemic travel trends, emphasis on safety protocols, and continued innovation in the sharing economy.',
    recommendations: [
      'Strengthen partnerships with local governments to address regulatory challenges proactively.',
      'Expand AI-driven customer support capabilities to reduce response times by 40%.',
      'Enhance safety communication across all marketing channels to maintain trust leadership.',
      'Invest in regulatory compliance technology to automate compliance monitoring.',
      'Leverage machine learning for dynamic pricing optimization and host recommendations.',
      'Develop exclusive experience partnerships with local businesses and cultural institutions.',
      'Implement advanced fraud detection systems to protect both hosts and guests.',
      'Create specialized onboarding programs for high-value property hosts.',
      'Expand insurance coverage options to address emerging market needs.',
      'Develop carbon-neutral travel options to appeal to environmentally conscious travelers.'
    ],
    sentiment_trends: [
      { month: 'Jan 2024', Airbnb: 78, Booking: 72, Vrbo: 68, Expedia: 65, Hotels: 70, Agoda: 62, TripAdvisor: 66 },
      { month: 'Feb 2024', Airbnb: 79, Booking: 73, Vrbo: 69, Expedia: 66, Hotels: 71, Agoda: 63, TripAdvisor: 67 },
      { month: 'Mar 2024', Airbnb: 80, Booking: 74, Vrbo: 70, Expedia: 67, Hotels: 72, Agoda: 64, TripAdvisor: 68 },
      { month: 'Apr 2024', Airbnb: 81, Booking: 74, Vrbo: 71, Expedia: 68, Hotels: 73, Agoda: 65, TripAdvisor: 69 },
      { month: 'May 2024', Airbnb: 82, Booking: 75, Vrbo: 71, Expedia: 68, Hotels: 74, Agoda: 66, TripAdvisor: 70 },
      { month: 'Jun 2024', Airbnb: 83, Booking: 76, Vrbo: 72, Expedia: 69, Hotels: 75, Agoda: 67, TripAdvisor: 71 },
      { month: 'Jul 2024', Airbnb: 85, Booking: 77, Vrbo: 73, Expedia: 70, Hotels: 76, Agoda: 68, TripAdvisor: 72 },
      { month: 'Aug 2024', Airbnb: 86, Booking: 78, Vrbo: 74, Expedia: 71, Hotels: 77, Agoda: 69, TripAdvisor: 73 },
      { month: 'Sep 2024', Airbnb: 84, Booking: 77, Vrbo: 73, Expedia: 70, Hotels: 76, Agoda: 68, TripAdvisor: 72 },
      { month: 'Oct 2024', Airbnb: 87, Booking: 79, Vrbo: 75, Expedia: 72, Hotels: 78, Agoda: 70, TripAdvisor: 74 },
      { month: 'Nov 2024', Airbnb: 88, Booking: 80, Vrbo: 76, Expedia: 73, Hotels: 79, Agoda: 71, TripAdvisor: 75 },
      { month: 'Dec 2024', Airbnb: 89, Booking: 81, Vrbo: 77, Expedia: 74, Hotels: 80, Agoda: 72, TripAdvisor: 76 },
    ],
    ranking_data: [
      { month: 'Jan 2024', Airbnb: 1.2, Booking: 2.1, Vrbo: 2.8, Expedia: 3.2, Hotels: 2.9, Agoda: 3.8, TripAdvisor: 3.5 },
      { month: 'Feb 2024', Airbnb: 1.1, Booking: 2.0, Vrbo: 2.7, Expedia: 3.1, Hotels: 2.8, Agoda: 3.7, TripAdvisor: 3.4 },
      { month: 'Mar 2024', Airbnb: 1.0, Booking: 1.9, Vrbo: 2.6, Expedia: 3.0, Hotels: 2.7, Agoda: 3.6, TripAdvisor: 3.3 },
      { month: 'Apr 2024', Airbnb: 1.0, Booking: 1.8, Vrbo: 2.5, Expedia: 2.9, Hotels: 2.6, Agoda: 3.5, TripAdvisor: 3.2 },
      { month: 'May 2024', Airbnb: 0.9, Booking: 1.7, Vrbo: 2.4, Expedia: 2.8, Hotels: 2.5, Agoda: 3.4, TripAdvisor: 3.1 },
      { month: 'Jun 2024', Airbnb: 0.8, Booking: 1.6, Vrbo: 2.3, Expedia: 2.7, Hotels: 2.4, Agoda: 3.3, TripAdvisor: 3.0 },
      { month: 'Jul 2024', Airbnb: 0.7, Booking: 1.5, Vrbo: 2.2, Expedia: 2.6, Hotels: 2.3, Agoda: 3.2, TripAdvisor: 2.9 },
      { month: 'Aug 2024', Airbnb: 0.6, Booking: 1.4, Vrbo: 2.1, Expedia: 2.5, Hotels: 2.2, Agoda: 3.1, TripAdvisor: 2.8 },
      { month: 'Sep 2024', Airbnb: 0.8, Booking: 1.6, Vrbo: 2.3, Expedia: 2.7, Hotels: 2.4, Agoda: 3.3, TripAdvisor: 3.0 },
      { month: 'Oct 2024', Airbnb: 0.5, Booking: 1.3, Vrbo: 2.0, Expedia: 2.4, Hotels: 2.1, Agoda: 3.0, TripAdvisor: 2.7 },
      { month: 'Nov 2024', Airbnb: 0.4, Booking: 1.2, Vrbo: 1.9, Expedia: 2.3, Hotels: 2.0, Agoda: 2.9, TripAdvisor: 2.6 },
      { month: 'Dec 2024', Airbnb: 0.3, Booking: 1.1, Vrbo: 1.8, Expedia: 2.2, Hotels: 1.9, Agoda: 2.8, TripAdvisor: 2.5 },
    ],
    share_of_rank: [
      { month: 'Jan 2024', Airbnb: 48, Booking: 32, Vrbo: 12, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Feb 2024', Airbnb: 50, Booking: 31, Vrbo: 11, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Mar 2024', Airbnb: 52, Booking: 30, Vrbo: 10, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Apr 2024', Airbnb: 54, Booking: 29, Vrbo: 9, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'May 2024', Airbnb: 56, Booking: 28, Vrbo: 8, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Jun 2024', Airbnb: 58, Booking: 27, Vrbo: 7, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Jul 2024', Airbnb: 60, Booking: 26, Vrbo: 6, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Aug 2024', Airbnb: 62, Booking: 25, Vrbo: 5, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Sep 2024', Airbnb: 59, Booking: 27, Vrbo: 6, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Oct 2024', Airbnb: 64, Booking: 24, Vrbo: 4, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Nov 2024', Airbnb: 66, Booking: 23, Vrbo: 3, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
      { month: 'Dec 2024', Airbnb: 68, Booking: 22, Vrbo: 2, Expedia: 8, Hotels: 7, Agoda: 5, TripAdvisor: 6, Others: 4 },
    ],
    overall_sentiment: [
      { name: 'Airbnb', score: 83, color: '#3B82F6' },
      { name: 'Booking.com', score: 77, color: '#10B981' },
      { name: 'Hotels.com', score: 75, color: '#F59E0B' },
      { name: 'Vrbo', score: 72, color: '#8B5CF6' },
      { name: 'Expedia', score: 68, color: '#F59E42' },
      { name: 'TripAdvisor', score: 71, color: '#EF4444' },
      { name: 'Agoda', score: 67, color: '#6366F1' },
      { name: 'Others', score: 60, color: '#6B7280' },
    ],
    competitor_analysis: {
      market_share: [
        { name: 'Airbnb', value: 54, color: '#3B82F6' },
        { name: 'Booking.com', value: 32, color: '#10B981' },
        { name: 'Vrbo', value: 10, color: '#8B5CF6' },
        { name: 'Expedia', value: 4, color: '#F59E42' },
      ],
      strengths: [
        'Dominant brand recognition in short-term rentals',
        'Extensive global marketplace with 7M+ listings',
        'Superior user experience and mobile app design',
        'Diverse accommodation options from apartments to castles',
        'Strong host community and support ecosystem',
        'Advanced search and filtering capabilities',
        'Robust review and rating system',
        'Innovative safety and trust features',
        'Strong presence in unique and local experiences',
        'Effective crisis management and adaptation strategies'
      ],
      weaknesses: [
        'Regulatory challenges and bans in major cities',
        'Variable quality control across listings',
        'Service fees perception among price-sensitive users',
        'Limited hotel inventory compared to traditional OTAs',
        'Dependency on individual hosts for service quality',
        'Seasonal demand fluctuations in certain markets',
        'Customer service response times during peak periods',
        'Host acquisition costs in competitive markets'
      ],
      opportunities: [
        { category: 'Growth', title: 'Expand to underserved markets', description: 'Increase presence in emerging markets with growing travel demand.', impact: 'high' as const, effort: 'medium' as const },
        { category: 'Product', title: 'AI-driven personalization engine', description: 'Implement advanced AI for personalized stay and experience recommendations.', impact: 'high' as const, effort: 'medium' as const },
        { category: 'Reputation', title: 'Proactive regulatory compliance', description: 'Develop technology solutions for automated compliance monitoring.', impact: 'high' as const, effort: 'high' as const },
        { category: 'Revenue', title: 'Business travel expansion', description: 'Capture corporate travel market with dedicated business solutions.', impact: 'medium' as const, effort: 'medium' as const },
        { category: 'Innovation', title: 'Sustainable travel initiatives', description: 'Lead in eco-friendly travel options and carbon offset programs.', impact: 'medium' as const, effort: 'low' as const },
        { category: 'Technology', title: 'Virtual reality previews', description: 'Implement VR technology for immersive property previews.', impact: 'medium' as const, effort: 'high' as const },
        { category: 'Partnership', title: 'Local experience partnerships', description: 'Expand partnerships with local businesses and cultural institutions.', impact: 'medium' as const, effort: 'low' as const },
        { category: 'Service', title: 'Premium concierge services', description: 'Launch high-end concierge services for luxury segment.', impact: 'low' as const, effort: 'medium' as const },
      ],
      strategic_priorities: [
        { id: 1, title: 'Global Host Partnership Program', description: 'Expand unique listings through strategic local partnerships and host incentives.', priority: 'high' as const, marketShare: 15 },
        { id: 2, title: 'Safety & Trust Initiative', description: 'Enhance and communicate safety standards, insurance coverage, and verification processes.', priority: 'high' as const, marketShare: 12 },
        { id: 3, title: 'Regulatory Compliance Automation', description: 'Develop AI-powered compliance monitoring and reporting systems.', priority: 'high' as const, marketShare: 10 },
        { id: 4, title: 'Business Travel Solutions', description: 'Create dedicated platform features for corporate travel management.', priority: 'medium' as const, marketShare: 8 },
        { id: 5, title: 'Sustainable Travel Leadership', description: 'Pioneer eco-friendly travel options and carbon neutrality programs.', priority: 'medium' as const, marketShare: 6 },
        { id: 6, title: 'AI-Powered Personalization', description: 'Implement machine learning for dynamic pricing and personalized recommendations.', priority: 'medium' as const, marketShare: 7 },
      ],
    },
    prompt_analysis: {
      sentiment_by_llm: { 
        ChatGPT: 85, 
        Gemini: 83, 
        Perplexity: 81, 
        Claude: 84, 
        'GPT-4': 86,
        'Llama 3': 80,
        'Mistral': 79,
        'PaLM': 82
      },
      ranking_by_prompt: {
        'What is the best platform for vacation rentals?': { Airbnb: 1, Vrbo: 2, 'Booking.com': 3, Expedia: 4, 'Hotels.com': 5 },
        'Where can I find unique travel accommodations?': { Airbnb: 1, Vrbo: 2, 'Unusual Hotels': 3, 'Booking.com': 4, Expedia: 5 },
        'Which platform is safest for short-term rentals?': { Airbnb: 1, 'Booking.com': 2, Vrbo: 3, Expedia: 4, 'Hotels.com': 5 },
        'Best app for booking apartments and homes?': { Airbnb: 1, Vrbo: 2, 'Booking.com': 3, Expedia: 4, 'Hotels.com': 5 },
        'What are Airbnb\'s main competitors?': { 'Booking.com': 1, Vrbo: 2, Expedia: 3, 'Hotels.com': 4, Airbnb: 5 },
        'Which platform has the most global listings?': { 'Booking.com': 1, Airbnb: 2, Expedia: 3, 'Hotels.com': 4, Agoda: 5 },
        'Best platform for family vacation rentals?': { Vrbo: 1, Airbnb: 2, 'Booking.com': 3, 'Hotels.com': 4, Expedia: 5 },
        'Where to book last-minute accommodations?': { 'Booking.com': 1, 'Hotels.com': 2, Airbnb: 3, Expedia: 4, Agoda: 5 },
        'Most trusted vacation rental platform?': { Airbnb: 1, Vrbo: 2, 'Booking.com': 3, Expedia: 4, 'Hotels.com': 5 },
        'Best platform for business travel accommodations?': { 'Booking.com': 1, 'Hotels.com': 2, Expedia: 3, Airbnb: 4, Agoda: 5 },
        'Which app has the best user interface?': { Airbnb: 1, 'Booking.com': 2, Expedia: 3, 'Hotels.com': 4, Vrbo: 5 },
        'Platform with best customer support?': { 'Booking.com': 1, 'Hotels.com': 2, Airbnb: 3, Expedia: 4, Vrbo: 5 },
        'Where to find eco-friendly accommodations?': { Airbnb: 1, 'Booking.com': 2, 'Hotels.com': 3, Expedia: 4, Vrbo: 5 },
        'Best platform for group bookings?': { Vrbo: 1, Airbnb: 2, 'Booking.com': 3, Expedia: 4, 'Hotels.com': 5 },
        'Which platform offers best cancellation policies?': { 'Booking.com': 1, Airbnb: 2, 'Hotels.com': 3, Expedia: 4, Vrbo: 5 },
        'Most innovative travel platform?': { Airbnb: 1, 'Booking.com': 2, Expedia: 3, 'Hotels.com': 4, TripAdvisor: 5 },
        'Platform with best mobile experience?': { Airbnb: 1, 'Booking.com': 2, 'Hotels.com': 3, Expedia: 4, Agoda: 5 },
        'Where to book luxury vacation rentals?': { Airbnb: 1, Vrbo: 2, 'Luxury Retreats': 3, 'Booking.com': 4, Expedia: 5 },
        'Best platform for international travel?': { 'Booking.com': 1, Airbnb: 2, Expedia: 3, Agoda: 4, 'Hotels.com': 5 },
        'Which platform has best pricing?': { 'Booking.com': 1, Airbnb: 2, Expedia: 3, Agoda: 4, 'Hotels.com': 5 },
      },
      performance_metrics: { 
        responseTime: 1.2, 
        avgTokens: 156,
        totalAnalyzedPrompts: 2847,
        aiModelsAnalyzed: 23,
        averageConfidenceScore: 87.3,
        dataFreshness: '2024-12-28'
      },
    },
    strategic_insights: {
      key_insights: [
        'Airbnb maintains dominant position in AI recommendations for unique and authentic travel experiences, mentioned first in 68% of relevant queries.',
        'Strong association with innovation and technology leadership, particularly in mobile experience and user interface design.',
        'Booking.com consistently outperforms in business travel and last-minute booking scenarios, capturing 34% market share in these segments.',
        'Vrbo shows strength in family and group travel recommendations, leading in 45% of family-focused queries despite smaller overall market share.',
        'AI systems frequently highlight Airbnb\'s superior host community and local experience offerings as key differentiators.',
        'Regulatory challenges are consistently mentioned across all AI models, indicating ongoing reputation risk that requires proactive management.',
        'Safety and trust features receive positive recognition, with 78% of safety-related queries ranking Airbnb favorably.',
        'Expedia and Hotels.com show strong performance in traditional hotel booking scenarios but lag in unique accommodation discussions.',
        'Emerging trend: AI models increasingly reference sustainability and eco-friendly travel options, where Airbnb has growth opportunities.',
        'Customer service response times are mentioned as an area for improvement across multiple AI model responses.',
        'Mobile app experience consistently rated as industry-leading across all analyzed AI platforms.',
        'International expansion opportunities highlighted, particularly in emerging markets with growing middle-class populations.'
      ],
      recommendations: [
        'Strengthen partnerships with local governments to address regulatory challenges proactively and reduce negative mentions.',
        'Expand AI-driven customer support capabilities to reduce response times by 40% and improve satisfaction scores.',
        'Enhance safety communication across all marketing channels to maintain trust leadership position.',
        'Invest in regulatory compliance technology to automate compliance monitoring and reduce operational risks.',
        'Leverage machine learning for dynamic pricing optimization and personalized host recommendations.',
        'Develop exclusive experience partnerships with local businesses and cultural institutions.',
        'Implement advanced fraud detection systems to protect both hosts and guests.',
        'Create specialized onboarding programs for high-value property hosts in key markets.',
        'Expand insurance coverage options to address emerging market needs and reduce liability concerns.',
        'Develop carbon-neutral travel options to appeal to environmentally conscious travelers.',
        'Launch business travel solutions to capture growing corporate accommodation market.',
        'Implement virtual reality property previews to enhance booking confidence.',
        'Expand premium concierge services for luxury market segment.',
        'Develop automated translation services for global host-guest communication.'
      ],
      action_items: [
        'Launch comprehensive host onboarding campaign in Q1 2025 targeting 50,000 new hosts.',
        'Update safety guidelines and communication materials in 25+ languages by March 2025.',
        'Implement AI-powered regulatory compliance monitoring system by June 2025.',
        'Deploy enhanced customer service chatbot with 90% query resolution rate by April 2025.',
        'Partner with 500+ local experience providers in top 50 markets by August 2025.',
        'Launch carbon offset program for all bookings by July 2025.',
        'Develop business travel portal with corporate billing features by September 2025.',
        'Implement VR property preview technology in 10,000 premium listings by October 2025.',
        'Expand insurance coverage to include pandemic-related cancellations by February 2025.',
        'Launch host mentorship program connecting experienced hosts with newcomers by May 2025.'
      ],
      growth_opportunities: [
        'Expand to emerging markets with growing travel demand (India, Southeast Asia, Latin America)',
        'Leverage AI for enhanced customer support and personalized recommendations',
        'Develop exclusive local experiences and cultural partnerships',
        'Launch business travel solutions for corporate market capture',
        'Pioneer sustainable travel initiatives and carbon neutrality programs',
        'Implement virtual reality technology for immersive property previews',
        'Expand luxury segment with premium concierge services',
        'Develop long-term stay solutions for remote workers and digital nomads',
        'Create specialized platforms for unique property types (boats, castles, treehouses)',
        'Launch host financing programs to improve property quality and availability'
      ],
      competitive_threats: [
        'Regulatory changes and potential bans in major metropolitan markets',
        'Emergence of specialized platforms targeting specific niches (luxury, business, eco-friendly)',
        'Traditional hotel chains developing direct-booking competitive offerings',
        'Negative press coverage related to safety incidents or discriminatory practices',
        'Economic downturns affecting discretionary travel spending',
        'Rising customer acquisition costs in mature markets',
        'Technology disruption from new entrants with innovative booking experiences',
        'Host attrition due to increased competition and regulatory compliance costs',
        'Currency fluctuations affecting international expansion and profitability',
        'Data privacy regulations limiting personalization and marketing capabilities',
        'Climate change concerns affecting travel patterns and destination viability',
        'Pandemic-related travel restrictions and changing consumer behavior patterns'
      ],
    },
  }
};

const DemoAirbnbContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                P
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PromptMetrics</h1>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Demo Airbnb
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Report for <b>www.airbnb.com</b>
              </span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="strategic-insights">Strategic Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <MyRankDashboardTab analysisData={analysisData} />
          </TabsContent>

          <TabsContent value="prompt-analysis">
            <MyRankPromptAnalysisTab analysisData={analysisData} />
          </TabsContent>

          <TabsContent value="competitor-analysis">
            <MyRankCompetitorAnalysisTab analysisData={analysisData} />
          </TabsContent>

          <TabsContent value="strategic-insights">
            <MyRankStrategicInsightsTab analysisData={analysisData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const DemoAirbnb = () => (
  <LanguageProvider>
    <AccessibilityProvider>
      <DemoAirbnbContent />
    </AccessibilityProvider>
  </LanguageProvider>
);

export default DemoAirbnb; 