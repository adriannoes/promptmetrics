import { render, screen } from '@testing-library/react';
import { FeatureCard } from './FeatureCard';

function DummyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" {...props}>
      <title>dummy</title>
    </svg>
  );
}

describe('FeatureCard', () => {
  it('renderiza título e descrição', () => {
    render(
      <FeatureCard
        icon={DummyIcon}
        title="Título do Card"
        description="Descrição do card"
      />
    );
    expect(screen.getByRole('heading', { name: 'Título do Card' })).toBeInTheDocument();
    expect(screen.getByText('Descrição do card')).toBeInTheDocument();
  });

  it('expõe role=article com aria-labelledby consistente', () => {
    render(
      <FeatureCard
        icon={DummyIcon}
        title="Recurso X"
        description="Detalhes"
      />
    );
    const heading = screen.getByRole('heading', { name: 'Recurso X' });
    const article = screen.getByRole('article');
    const labelledBy = article.getAttribute('aria-labelledby');
    expect(labelledBy).toBe(heading.getAttribute('id'));
  });
});


