// --- Random mode ---
export type RandomMode = "picker" | "shuffle" | "numbers" | "dice";

export function pickOne<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateNumbers(
  min: number,
  max: number,
  count: number,
  unique: boolean
): number[] | { error: string } {
  if (min > max) return { error: "Min must be <= max" };
  if (count <= 0) return [];
  if (unique) {
    const range = max - min + 1;
    if (count > range)
      return { error: `Cannot generate ${count} unique numbers from a range of ${range}` };
    const set = new Set<number>();
    while (set.size < count) {
      set.add(Math.floor(Math.random() * range) + min);
    }
    return [...set];
  }
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

const DICE_FACES = [4, 6, 8, 10, 12, 20, 100] as const;

export function rollDice(faces: number, quantity: number): number[] {
  const valid = (DICE_FACES as readonly number[]).includes(faces) ? faces : 6;
  return Array.from({ length: Math.max(1, quantity) }, () => Math.floor(Math.random() * valid) + 1);
}

export { DICE_FACES };
