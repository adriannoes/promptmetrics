export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aBuf = new TextEncoder().encode(a);
  const bBuf = new TextEncoder().encode(b);
  const len = Math.max(aBuf.length, bBuf.length);
  let result = 0;
  for (let i = 0; i < len; i++) {
    const x = aBuf[i % aBuf.length] ?? 0;
    const y = bBuf[i % bBuf.length] ?? 0;
    result |= x ^ y;
  }
  return result === 0 && aBuf.length === bBuf.length;
}


