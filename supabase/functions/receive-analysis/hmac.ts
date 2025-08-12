// Cross-runtime HMAC utilities (Deno / Node 18+)

export async function signHmacSha256Base64(rawBody: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody));
  return toBase64(new Uint8Array(signature));
}

export async function verifyHmacSha256Base64(rawBody: string, providedSignatureBase64: string, secret: string): Promise<boolean> {
  const computed = await signHmacSha256Base64(rawBody, secret);
  return constantTimeEqual(computed, providedSignatureBase64);
}

export function constantTimeEqual(a: string, b: string): boolean {
  const ua = new TextEncoder().encode(a);
  const ub = new TextEncoder().encode(b);
  if (ua.length !== ub.length) return false;
  let result = 0;
  for (let i = 0; i < ua.length; i++) {
    result |= ua[i] ^ ub[i];
  }
  return result === 0;
}

function toBase64(bytes: Uint8Array): string {
  // Prefer btoa when available (Deno). Fallback to Node Buffer when present.
  // Avoid atob/btoa on Node where it may not exist.
  try {
    // @ts-ignore btoa may exist (Deno)
    if (typeof btoa === 'function') {
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      // @ts-ignore
      return btoa(binary);
    }
  } catch {}
  try {
    // @ts-ignore Buffer may exist (Node)
    return Buffer.from(bytes).toString('base64');
  } catch {
    // Fallback (should not happen in Deno/Node)
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    // @ts-ignore
    return (globalThis as any).btoa ? (globalThis as any).btoa(binary) : binary;
  }
}


