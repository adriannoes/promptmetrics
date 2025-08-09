import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

const Probe = () => {
  const loc = useLocation();
  return <div data-testid="path">{loc.pathname}</div>;
};

async function renderWithAuth(profile: any, initialPath: string) {
  vi.resetModules();
  vi.doMock('@/contexts/AuthContext', () => ({
    useAuth: () => ({ loading: false, profile }),
  }));

  const { SmartRedirect } = await import('./SmartRedirect');

  const utils = render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/*" element={<SmartRedirect><Probe /></SmartRedirect>} />
      </Routes>
    </MemoryRouter>
  );
  return utils.findByTestId('path');
}

describe('SmartRedirect', () => {
  it('redireciona para /domain-setup quando não há domínio', async () => {
    const el = await renderWithAuth(
      { role: 'client', organization_id: null, organizations: null },
      '/home'
    );
    expect(el.textContent).toBe('/domain-setup');
  });

  it('com domínio e acessando /domain-setup redireciona para /home', async () => {
    const el = await renderWithAuth(
      { role: 'client', organization_id: 'org1', organizations: { website_url: 'https://example.com' } },
      '/domain-setup'
    );
    expect(el.textContent).toBe('/home');
  });
});


