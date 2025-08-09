import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrganizationDashboard from './OrganizationDashboard';
import { LanguageProvider } from '@/contexts/LanguageContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('OrganizationDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage spy
    vi.restoreAllMocks();
  });

  it('navega para /analysis com domain e persiste no localStorage ao clicar no CTA', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    const organization = {
      id: 'org-1',
      name: 'Org Test',
      slug: 'org-test',
      website_url: 'https://example.com',
    };

    render(
      <LanguageProvider>
        <OrganizationDashboard organization={organization as any} />
      </LanguageProvider>
    );

    const btn = screen.getByTestId('my-analysis-btn');
    fireEvent.click(btn);

    expect(setItemSpy).toHaveBeenCalledWith('userDomain', 'example.com');
    expect(mockNavigate).toHaveBeenCalledWith('/analysis?domain=example.com');
  });
});


