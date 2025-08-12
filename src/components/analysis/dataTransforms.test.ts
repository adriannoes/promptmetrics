import { describe, it, expect } from 'vitest';
import { orderSeriesKeys, trimToTop5WithOthers } from './dataTransforms';

describe('dataTransforms - cliente primeiro', () => {
  it('coloca a série do domínio primeiro (match exato)', () => {
    const keys = ['Bolt', 'pipefy.com', 'V0'];
    const ordered = orderSeriesKeys('pipefy.com', keys);
    expect(ordered[0]).toBe('pipefy.com');
  });

  it('coloca a série do domínio primeiro (match por includes)', () => {
    const keys = ['Bolt', 'Pipefy', 'V0'];
    const ordered = orderSeriesKeys('pipefy.com', keys);
    expect(ordered[0]).toBe('Pipefy');
  });
});

describe('dataTransforms - Top 5 + Others', () => {
  const rows = [
    { month: 'Jan', You: 50, A: 10, B: 9, C: 8, D: 7, E: 6, F: 5, G: 4 },
    { month: 'Feb', You: 60, A: 11, B: 9, C: 8, D: 7, E: 6, F: 5, G: 4 },
  ];

  it('mantém cliente e Top 5, somando demais em Others', () => {
    const result = trimToTop5WithOthers('you', rows);
    expect(result[0]).toHaveProperty('You');
    // Deve conter Others
    expect(result[0]).toHaveProperty('Others');
    // Soma dos removidos (ex.: F+G) para Jan = 5 + 4 = 9
    const janOthers = Number(result[0]['Others']);
    expect(janOthers).toBeGreaterThan(0);
  });
});


