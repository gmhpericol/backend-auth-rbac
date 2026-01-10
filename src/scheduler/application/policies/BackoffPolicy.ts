export function exponentialBackoff(
  attempt: number,
  baseMs = 1_000
): number {
  return baseMs * Math.pow(2, attempt - 1);
}
