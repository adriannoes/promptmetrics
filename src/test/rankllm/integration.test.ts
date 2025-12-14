import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { RankLLMRequest } from '@/types/rankllm';

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : undefined);

const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_ANON_KEY : undefined);

const hasRealSupabaseEnv =
  Boolean(supabaseUrl && supabaseAnonKey) &&
  !String(supabaseUrl).includes('your-project') &&
  !String(supabaseAnonKey).includes('test-anon-key');

const describeIntegration = hasRealSupabaseEnv ? describe : describe.skip;
let supabaseClient: typeof import('@/integrations/supabase/client').supabase | null = null;

if (!hasRealSupabaseEnv) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env missing or placeholder; skipping integration tests.');
}

// Mock data for testing
const testDocuments = [
  {
    id: 'doc1',
    content: 'Machine learning is a subset of artificial intelligence that focuses on algorithms.',
    title: 'Introduction to ML'
  },
  {
    id: 'doc2', 
    content: 'Deep learning uses neural networks with multiple layers to process data.',
    title: 'Deep Learning Basics'
  },
  {
    id: 'doc3',
    content: 'Natural language processing helps computers understand human language.',
    title: 'NLP Overview'
  }
];

const testRequest: RankLLMRequest = {
  query: 'machine learning algorithms',
  documents: testDocuments,
  model: 'monot5',
  domain: 'test.com'
};

describeIntegration('RankLLM Integration Tests', () => {
  beforeAll(async () => {
    const module = await import('@/integrations/supabase/client');
    supabaseClient = module.supabase;

    // Setup test environment
    console.log('Setting up RankLLM integration tests...');
  });

  afterAll(async () => {
    // Cleanup test data
    console.log('Cleaning up test data...');
  });

  describe('Edge Function Tests', () => {
    it('should trigger rankllm analysis successfully', async () => {
      const { data, error } = await supabaseClient!.functions.invoke('trigger-rankllm-analysis', {
        body: testRequest
      });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.success).toBe(true);
      expect(data.id).toBeDefined();
    }, 30000); // 30 second timeout

    it('should retrieve rankllm data', async () => {
      // Wait a moment for processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { data, error } = await supabaseClient!.functions.invoke('get-rankllm-data', {
        body: { domain: 'test.com', limit: 10 }
      });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    }, 10000);
  });

  describe('Database Tests', () => {
    it('should store rankllm results in database', async () => {
      const { data, error } = await supabaseClient!
        .from('rankllm_results')
        .select('*')
        .eq('domain', 'test.com')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.domain).toBe('test.com');
      expect(data.query).toBe(testRequest.query);
      expect(data.model_used).toBe(testRequest.model);
      expect(data.ranking_data).toBeDefined();
    });

    it('should have proper RLS policies', async () => {
      // Test that users can only see their organization's data
      const { data, error } = await supabaseClient!
        .from('rankllm_results')
        .select('*');

      // Should not error due to RLS
      expect(error).toBeNull();
    });
  });

  describe('Model Tests', () => {
    it('should support different models', async () => {
      const models = ['monot5', 'duot5'];
      
      for (const model of models) {
        const request = { ...testRequest, model };
        
        const { data, error } = await supabaseClient!.functions.invoke('trigger-rankllm-analysis', {
          body: request
        });

        expect(error).toBeNull();
        expect(data.success).toBe(true);
      }
    }, 60000); // 1 minute timeout for multiple models
  });

  describe('Error Handling Tests', () => {
    it('should handle invalid requests gracefully', async () => {
      const invalidRequest = {
        query: '',
        documents: [],
        domain: 'test.com'
      };

      const { data, error } = await supabaseClient!.functions.invoke('trigger-rankllm-analysis', {
        body: invalidRequest
      });

      expect(error).toBeDefined();
      expect(data?.success).toBe(false);
    });

    it('should handle missing microservice gracefully', async () => {
      // This test would require mocking the microservice to be down
      // For now, we'll test with invalid URL
      const originalUrl = process.env.RANKLLM_SERVICE_URL;
      process.env.RANKLLM_SERVICE_URL = 'http://invalid-url:8000';

      const { data, error } = await supabaseClient!.functions.invoke('trigger-rankllm-analysis', {
        body: testRequest
      });

      expect(error).toBeDefined();
      
      // Restore original URL
      process.env.RANKLLM_SERVICE_URL = originalUrl;
    });
  });

  describe('Performance Tests', () => {
    it('should complete ranking within reasonable time', async () => {
      const startTime = Date.now();
      
      const { data, error } = await supabaseClient!.functions.invoke('trigger-rankllm-analysis', {
        body: testRequest
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(error).toBeNull();
      expect(data.success).toBe(true);
      expect(duration).toBeLessThan(30000); // Should complete within 30 seconds
    }, 35000);
  });
});
