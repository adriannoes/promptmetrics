import { useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    target: string[];
    html: string;
    failureSummary: string;
  }>;
}

interface AccessibilityResults {
  violations: AccessibilityViolation[];
  passes: Array<{ id: string; description: string }>;
  incomplete: Array<{ id: string; description: string }>;
  inapplicable: Array<{ id: string; description: string }>;
}

export const useAccessibilityAudit = () => {
  const runAudit = useCallback(async (): Promise<AccessibilityResults | null> => {
    if (typeof window === 'undefined') return null;

    try {
      // Dynamic import for better bundle splitting
      const axe = await import('axe-core');

      // Run accessibility audit
      const results = await axe.default.run(document, {
        rules: {
          // Focus on critical accessibility issues
          'color-contrast': { enabled: true },
          'keyboard': { enabled: true },
          'focus-visible': { enabled: true },
          'heading-order': { enabled: true },
          'image-alt': { enabled: true },
          'link-name': { enabled: true },
          'button-name': { enabled: true },
          'input-button-name': { enabled: true },
          'label': { enabled: true },
          'aria-allowed-attr': { enabled: true },
          'aria-required-attr': { enabled: true },
          'aria-valid-attr': { enabled: true },
        }
      });

      return results as AccessibilityResults;
    } catch (error) {
      logger.error('Accessibility audit failed', error);
      return null;
    }
  }, []);

  const logViolations = useCallback((results: AccessibilityResults) => {
    if (results.violations.length > 0) {
      logger.warn('Accessibility violations found', {
        count: results.violations.length,
        violations: results.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          nodes: v.nodes.length
        }))
      });

      // Log critical violations as errors
      const criticalViolations = results.violations.filter(v => v.impact === 'critical');
      if (criticalViolations.length > 0) {
        logger.error('Critical accessibility violations', {
          count: criticalViolations.length,
          violations: criticalViolations
        });
      }
    } else {
      logger.info('Accessibility audit passed - no violations found');
    }
  }, []);

  const auditAndLog = useCallback(async () => {
    const results = await runAudit();
    if (results) {
      logViolations(results);
      return results;
    }
    return null;
  }, [runAudit, logViolations]);

  useEffect(() => {
    // Run accessibility audit in development
    if (import.meta.env.DEV) {
      // Delay to ensure DOM is fully loaded
      const timer = setTimeout(() => {
        auditAndLog();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [auditAndLog]);

  return {
    runAudit,
    auditAndLog,
    logViolations,
  };
};
