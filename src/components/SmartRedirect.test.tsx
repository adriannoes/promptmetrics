import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { SmartRedirect } from './SmartRedirect';

// Mock useAuth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    loading: false,
    profile: {
      role: 'client',
      organization_id: null,
      organizations: null,
    },
  }),
}));

const Probe = () => {
  const loc = useLocation();
  return <div data-testid="path">{loc.pathname}</div>;
};

describe('SmartRedirect', () => {
  it('redireciona para /domain-setup quando não há domínio', async () => {
    const { findByTestId } = render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/*" element={<SmartRedirect><Probe /></SmartRedirect>} />
        </Routes>
      </MemoryRouter>
    );

    const el = await findByTestId('path');
    expect(el.textContent).toBe('/domain-setup');
  });
});


