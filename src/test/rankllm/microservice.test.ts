import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Mock microservice tests (requires running microservice)
const MICROSERVICE_URL = process.env.RANKLLM_SERVICE_URL || 'http://localhost:8000';

describe('RankLLM Microservice Tests', () => {
  beforeAll(async () => {
    // Check if microservice is running
    try {
      const response = await fetch(`${MICROSERVICE_URL}/health`);
      if (!response.ok) {
        throw new Error('Microservice not running');
      }
    } catch (error) {
      console.warn('Microservice not available, skipping tests');
    }
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await fetch(`${MICROSERVICE_URL}/health`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.status).toBe('healthy');
      expect(data.models_available).toBeDefined();
      expect(Array.isArray(data.models_available)).toBe(true);
    });
  });

  describe('Models Endpoint', () => {
    it('should list available models', async () => {
      const response = await fetch(`${MICROSERVICE_URL}/models`);
      expect(response.ok).toBe(true);
      
      const models = await response.json();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      
      // Check model structure
      const model = models[0];
      expect(model.name).toBeDefined();
      expect(model.type).toBeDefined();
      expect(model.description).toBeDefined();
    });
  });

  describe('Rerank Endpoint', () => {
    const testRequest = {
      query: 'machine learning algorithms',
      documents: [
        {
          id: 'doc1',
          content: 'Machine learning is a subset of artificial intelligence.',
          title: 'ML Introduction'
        },
        {
          id: 'doc2',
          content: 'Deep learning uses neural networks with multiple layers.',
          title: 'Deep Learning'
        }
      ],
      model: 'monot5',
      domain: 'test.com'
    };

    it('should rank documents successfully', async () => {
      const response = await fetch(`${MICROSERVICE_URL}/rerank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequest)
      });

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result.id).toBeDefined();
      expect(result.domain).toBe(testRequest.domain);
      expect(result.query).toBe(testRequest.query);
      expect(result.model_used).toBe(testRequest.model);
      expect(result.ranking_data).toBeDefined();
      expect(result.ranking_data.candidates).toBeDefined();
      expect(Array.isArray(result.ranking_data.candidates)).toBe(true);
    }, 30000);

    it('should return ranked candidates with scores', async () => {
      const response = await fetch(`${MICROSERVICE_URL}/rerank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequest)
      });

      const result = await response.json();
      const candidates = result.ranking_data.candidates;
      
      expect(candidates.length).toBeGreaterThan(0);
      
      // Check candidate structure
      const candidate = candidates[0];
      expect(candidate.docid).toBeDefined();
      expect(candidate.score).toBeDefined();
      expect(candidate.rank).toBeDefined();
      expect(candidate.doc).toBeDefined();
      
      // Check scores are in descending order
      for (let i = 1; i < candidates.length; i++) {
        expect(candidates[i-1].score).toBeGreaterThanOrEqual(candidates[i].score);
      }
    }, 30000);

    it('should handle different models', async () => {
      const models = ['monot5', 'duot5'];
      
      for (const model of models) {
        const request = { ...testRequest, model };
        
        const response = await fetch(`${MICROSERVICE_URL}/rerank`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        });

        expect(response.ok).toBe(true);
        
        const result = await response.json();
        expect(result.model_used).toBe(model);
      }
    }, 60000);

    it('should handle invalid requests', async () => {
      const invalidRequest = {
        query: '',
        documents: [],
        domain: 'test.com'
      };

      const response = await fetch(`${MICROSERVICE_URL}/rerank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRequest)
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should handle unknown model', async () => {
      const request = {
        ...testRequest,
        model: 'unknown_model'
      };

      const response = await fetch(`${MICROSERVICE_URL}/rerank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('Performance Tests', () => {
    it('should complete ranking within reasonable time', async () => {
      const startTime = Date.now();
      
      const response = await fetch(`${MICROSERVICE_URL}/rerank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequest)
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.ok).toBe(true);
      expect(duration).toBeLessThan(30000); // Should complete within 30 seconds
    }, 35000);

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(3).fill(null).map((_, i) => ({
        ...testRequest,
        query: `test query ${i}`,
        domain: `test${i}.com`
      }));

      const promises = requests.map(request => 
        fetch(`${MICROSERVICE_URL}/rerank`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        })
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.ok).toBe(true);
      });
    }, 60000);
  });
});
