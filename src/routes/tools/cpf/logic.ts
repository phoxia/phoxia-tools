export function stripCpf(input: string): string {
  return input.replace(/\D/g, "");
}

export function formatCpf(digits: string): string {
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

function calcDigit(digits: number[], weight: number): number {
  const sum = digits.reduce((acc, d, i) => acc + d * (weight - i), 0);
  const r = sum % 11;
  return r < 2 ? 0 : 11 - r;
}

export function isValidCpf(cpf: string): boolean {
  const d = stripCpf(cpf);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;
  const nums = d.split("").map(Number);
  const d1 = calcDigit(nums.slice(0, 9), 10);
  if (nums[9] !== d1) return false;
  const d2 = calcDigit(nums.slice(0, 10), 11);
  return nums[10] === d2;
}

function randDigit(): number {
  return Math.floor(Math.random() * 10);
}

export function generateCpf(formatted = true): string {
  const nums = Array.from({ length: 9 }, randDigit);
  nums.push(calcDigit(nums, 10));
  nums.push(calcDigit(nums, 11));
  const raw = nums.join("");
  return formatted ? formatCpf(raw) : raw;
}
