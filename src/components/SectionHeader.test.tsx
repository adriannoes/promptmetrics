import { render, screen } from '@testing-library/react';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renderiza título simples', () => {
    render(<SectionHeader title="Meu Título" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Meu Título' })).toBeInTheDocument();
  });

  it('renderiza tag (badge) quando fornecida', () => {
    render(<SectionHeader tag="Destaque" title="Título" />);
    expect(screen.getByText('Destaque')).toBeInTheDocument();
  });

  it('renderiza subtitle quando fornecido', () => {
    render(<SectionHeader title="Título" subtitle="Texto de apoio" />);
    expect(screen.getByText('Texto de apoio')).toBeInTheDocument();
  });
});


