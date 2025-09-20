
export const flashCardData = [
  { title: 'Average Rank', value: '2.3', subtitle: 'Average product position within prompt results', icon: 'BarChart3', color: 'bg-blue-100 text-blue-600' },
  { title: 'Prevalence', value: '60%', subtitle: '% of total prompt runs in which your product appears', icon: 'Target', color: 'bg-orange-100 text-orange-600' },
  { title: 'Category Rank', value: '2/4', subtitle: 'Ranked by prevalence relative to all products in prompt results', icon: 'TrendingUp', color: 'bg-yellow-100 text-yellow-600' },
  { title: '% Positive Sentiment', value: '78%', subtitle: 'Percentage of positive mentions across all prompts', icon: 'Heart', color: 'bg-green-100 text-green-600' },
];

export const overallSentimentData = [
  { name: 'Lovable', score: 77.6, color: '#3B82F6' },
  { name: 'Bolt', score: 73.4, color: '#10B981' },
  { name: 'V0', score: 68.8, color: '#8B5CF6' },
  { name: 'Figma Make', score: 59.6, color: '#F59E0B' },
];

export const llmSentimentData = [
  { llm: 'ChatGPT', lovable: 78, bolt: 72, v0: 65, figmaMake: 58 },
  { llm: 'Google AI Search', lovable: 82, bolt: 69, v0: 71, figmaMake: 62 },
  { llm: 'Claude', lovable: 85, bolt: 75, v0: 68, figmaMake: 55 },
  { llm: 'Perplexity', lovable: 80, bolt: 73, v0: 66, figmaMake: 60 },
  { llm: 'Grok', lovable: 65, bolt: 78, v0: 74, figmaMake: 63 },
];

export const promptsData = [
  {
    prompt: 'best AI code editor',
    volume: 5,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 3 }, v0: { present: false, rank: null }, figmaMake: { present: false, rank: null } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 4 }, figmaMake: { present: false, rank: null } },
      { llm: 'Claude', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: false, rank: null }, figmaMake: { present: true, rank: 5 } },
      { llm: 'Perplexity', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 4 }, v0: { present: true, rank: 3 }, figmaMake: { present: false, rank: null } },
      { llm: 'Grok', lovable: { present: false, rank: null }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 2 }, figmaMake: { present: true, rank: 3 } },
    ]
  },
  {
    prompt: 'visual programming platforms',
    volume: 3,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 4 }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 5 } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 2 }, figmaMake: { present: true, rank: 4 } },
      { llm: 'Claude', lovable: { present: true, rank: 3 }, bolt: { present: false, rank: null }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 2 } },
      { llm: 'Perplexity', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 1 }, figmaMake: { present: false, rank: null } },
      { llm: 'Grok', lovable: { present: false, rank: null }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 3 } },
    ]
  },
  {
    prompt: 'no-code web development',
    volume: 4,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 3 }, figmaMake: { present: false, rank: null } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 4 }, figmaMake: { present: true, rank: 3 } },
      { llm: 'Claude', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 2 }, figmaMake: { present: false, rank: null } },
      { llm: 'Perplexity', lovable: { present: true, rank: 3 }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 2 }, figmaMake: { present: true, rank: 4 } },
      { llm: 'Grok', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: false, rank: null }, figmaMake: { present: true, rank: 3 } },
    ]
  },
  {
    prompt: 'rapid prototyping tools',
    volume: 2,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 3 }, bolt: { present: false, rank: null }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 2 } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 4 }, v0: { present: true, rank: 2 }, figmaMake: { present: true, rank: 3 } },
      { llm: 'Claude', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: false, rank: null }, figmaMake: { present: true, rank: 3 } },
      { llm: 'Perplexity', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 3 }, figmaMake: { present: false, rank: null } },
      { llm: 'Grok', lovable: { present: false, rank: null }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 1 }, figmaMake: { present: true, rank: 2 } },
    ]
  },
  {
    prompt: 'AI-powered development platforms',
    volume: 5,
    llmData: [
      { llm: 'ChatGPT', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: false, rank: null }, figmaMake: { present: false, rank: null } },
      { llm: 'Google AI Search', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 3 }, v0: { present: true, rank: 2 }, figmaMake: { present: false, rank: null } },
      { llm: 'Claude', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 3 }, figmaMake: { present: true, rank: 4 } },
      { llm: 'Perplexity', lovable: { present: true, rank: 2 }, bolt: { present: true, rank: 1 }, v0: { present: true, rank: 3 }, figmaMake: { present: false, rank: null } },
      { llm: 'Grok', lovable: { present: true, rank: 1 }, bolt: { present: true, rank: 2 }, v0: { present: true, rank: 3 }, figmaMake: { present: true, rank: 4 } },
    ]
  },
];

export const allLlms = [
  { id: 'ChatGPT', name: 'ChatGPT' },
  { id: 'Google AI Search', name: 'Google AI Search' },
  { id: 'Claude', name: 'Claude' },
  { id: 'Perplexity', name: 'Perplexity' },
  { id: 'Grok', name: 'Grok' },
];

export const allCompetitors = [
  { id: 'lovable', name: 'Lovable' },
  { id: 'bolt', name: 'Bolt' },
  { id: 'v0', name: 'V0' },
  { id: 'figmaMake', name: 'Figma Make' },
];
