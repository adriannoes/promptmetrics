export const getAllowedOrigins = (env: string | null) => {
  const origins = [
    'https://f7f9381f-ef1d-491b-bfc3-dadb313a13c9.lovableproject.com',
  ];
  if (env !== 'production') {
    origins.push('http://localhost:5173');
  }
  return origins;
};

export const getCorsHeaders = (origin: string | null, allowed: string[]) => {
  const isAllowed = !!origin && allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin! : '',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  } as Record<string, string>;
};


