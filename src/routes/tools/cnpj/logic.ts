export function stripCnpj(input: string): string {
  return input.replace(/\D/g, "");
}

export function formatCnpj(digits: string): string {
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

const W1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const W2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  const r = sum % 11;
  return r < 2 ? 0 : 11 - r;
}

export function isValidCnpj(cnpj: string): boolean {
  const d = stripCnpj(cnpj);
  if (d.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(d)) return false;
  const nums = d.split("").map(Number);
  const d1 = calcDigit(nums.slice(0, 12), W1);
  if (nums[12] !== d1) return false;
  const d2 = calcDigit(nums.slice(0, 13), W2);
  return nums[13] === d2;
}

function randDigit(): number {
  return Math.floor(Math.random() * 10);
}

export function generateCnpj(formatted = true): string {
  const base = Array.from({ length: 8 }, randDigit);
  // branch 0001
  const nums = [...base, 0, 0, 0, 1];
  nums.push(calcDigit(nums, W1));
  nums.push(calcDigit(nums, W2));
  const raw = nums.join("");
  return formatted ? formatCnpj(raw) : raw;
}
