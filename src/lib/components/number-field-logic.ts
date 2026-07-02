export function isAllowedChars(prospective: string, integerOnly: boolean): boolean {
  return integerOnly ? /^-?[0-9]*$/.test(prospective) : /^-?[0-9]*\.?[0-9]*$/.test(prospective);
}

export function exceedsMax(prospective: string, max?: number): boolean {
  if (max === undefined || prospective === "" || prospective === "-") return false;
  const n = Number(prospective);
  return !Number.isNaN(n) && n > max;
}

export function clampNumber(n: number, min?: number, max?: number, integerOnly = true): number {
  let v = integerOnly ? Math.round(n) : n;
  if (min !== undefined) v = Math.max(v, min);
  if (max !== undefined) v = Math.min(v, max);
  return v;
}
