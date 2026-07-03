/**
 * Safely extract a single string value from Express query params
 * (which can be string | string[] | ParsedQs)
 */
export function qs(val: unknown): string | undefined {
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val[0] as string;
  return undefined;
}
