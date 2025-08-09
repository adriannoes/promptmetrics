import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    loading: false,
    profile: { id: 'u1', organization_id: 'org1' },
  }),
}));

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    success: (...args: any[]) => toastSuccess(...args),
    error: (...args: any[]) => toastError(...args),
  },
}));

// Build a flexible mock for supabase client used in DomainSetup
const mockInvoke = vi.fn();
const mockSelectSingle = vi.fn();
const mockUpdateEq = vi.fn();

vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: (..._args: any[]) => mockUpdateEq(),
        })),
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: (..._args: any[]) => mockSelectSingle(),
          })),
        })),
      })),
      functions: {
        invoke: (...args: any[]) => mockInvoke(...args),
      },
    },
  };
});

describe('DomainSetup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // default mocks
    mockUpdateEq.mockResolvedValue({ error: null });
    mockSelectSingle.mockResolvedValue({ data: { slug: 'acme' }, error: null });
    mockInvoke.mockResolvedValue({ data: { success: true }, error: null });
  });

  async function setup() {
    const { default: DomainSetup } = await import('./DomainSetup');
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DomainSetup />
      </MemoryRouter>
    );
    return { user };
  }

  it('dispara trigger-analysis com domínio limpo após salvar domínio', async () => {
    const { user } = await setup();

    const input = screen.getByPlaceholderText('example.com');
    await user.type(input, 'https://example.com/');

    const button = screen.getByRole('button', { name: /continue setup/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockUpdateEq).toHaveBeenCalled();
      expect(mockInvoke).toHaveBeenCalledWith('trigger-analysis', {
        body: { domain: 'example.com' },
      });
    });
  });

  it('não dispara invoke e mostra erro quando domínio é inválido', async () => {
    const { user } = await setup();

    const input = screen.getByPlaceholderText('example.com');
    await user.type(input, 'invalid_domain');

    const button = screen.getByRole('button', { name: /continue setup/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockInvoke).not.toHaveBeenCalled();
      expect(toastError).toHaveBeenCalled();
    });
  });

  it('exibe erro quando invoke falha e não muda para estado de sucesso', async () => {
    mockInvoke.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });

    const { user } = await setup();

    const input = screen.getByPlaceholderText('example.com');
    await user.type(input, 'example.com');

    const button = screen.getByRole('button', { name: /continue setup/i });
    await user.click(button);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalled();
      // texto de sucesso só aparece quando step === 'success'
      expect(screen.queryByText(/Redirecting to your dashboard/i)).toBeNull();
    });
  });
});


