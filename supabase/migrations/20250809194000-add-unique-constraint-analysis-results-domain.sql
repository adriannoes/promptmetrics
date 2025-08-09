-- Ensure unique domain in analysis_results to support onConflict('domain') in upserts
-- 1) Optional: cleanup duplicates, keeping the most recent by updated_at/created_at
WITH duplicates AS (
  SELECT
    id,
    domain,
    updated_at,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY domain ORDER BY updated_at DESC, created_at DESC) AS rn
  FROM public.analysis_results
)
DELETE FROM public.analysis_results ar
USING duplicates d
WHERE ar.id = d.id
  AND d.rn > 1;

-- 2) Add unique constraint on domain
ALTER TABLE public.analysis_results
ADD CONSTRAINT analysis_results_domain_key UNIQUE (domain);


