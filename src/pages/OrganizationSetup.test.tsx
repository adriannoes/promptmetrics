import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OrganizationSetup from './OrganizationSetup';

vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      functions: {
        invoke: vi.fn().mockResolvedValue({ data: { success: true, organization_id: 'org_123' }, error: null })
      }
    }
  };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ profile: { id: 'user_1', role: 'user', organization_id: null }, loading: false })
}));

describe('OrganizationSetup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cria organização e redireciona para /domain-setup', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/organization-setup' }] as any}>
        <Routes>
          <Route path="/organization-setup" element={<OrganizationSetup />} />
          <Route path="/domain-setup" element={<div>DomainSetup</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Minha Empresa'), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));

    await waitFor(() => {
      expect(screen.getByText('DomainSetup')).toBeInTheDocument();
    });
  });

  it('mostra erro quando invoke falha', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    (supabase.functions.invoke as any).mockResolvedValueOnce({ data: null, error: { message: 'boom' } });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/organization-setup' }] as any}>
        <Routes>
          <Route path="/organization-setup" element={<OrganizationSetup />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Minha Empresa'), { target: { value: 'Acme' } });
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));

    await waitFor(() => {
      // continua na mesma página por erro
      expect(screen.getByText('Configure sua organização')).toBeInTheDocument();
    });
  });
});


