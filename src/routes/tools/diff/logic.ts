export type DiffLine = {
  type: "equal" | "added" | "removed";
  text: string;
  leftLine?: number;
  rightLine?: number;
};

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

function backtrack(
  dp: number[][],
  a: string[],
  b: string[],
  i: number,
  j: number,
  out: DiffLine[],
  lLeft: number[],
  lRight: number[]
): void {
  if (i === 0 && j === 0) return;
  if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
    backtrack(dp, a, b, i - 1, j - 1, out, lLeft, lRight);
    out.push({ type: "equal", text: a[i - 1], leftLine: lLeft[i - 1], rightLine: lRight[j - 1] });
  } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
    backtrack(dp, a, b, i, j - 1, out, lLeft, lRight);
    out.push({ type: "added", text: b[j - 1], rightLine: lRight[j - 1] });
  } else {
    backtrack(dp, a, b, i - 1, j, out, lLeft, lRight);
    out.push({ type: "removed", text: a[i - 1], leftLine: lLeft[i - 1] });
  }
}

const MAX_DIFF_LINES = 5000;

export function computeDiff(left: string, right: string): DiffLine[] {
  const a = left === "" ? [] : left.split("\n");
  const b = right === "" ? [] : right.split("\n");
  if (!a.length && !b.length) return [];
  if (a.length > MAX_DIFF_LINES || b.length > MAX_DIFF_LINES) {
    return [
      {
        type: "removed",
        text: `Diff too large (max ${MAX_DIFF_LINES} lines per side)`,
        leftLine: 1,
      },
    ];
  }

  const lLeft = a.map((_, i) => i + 1);
  const lRight = b.map((_, i) => i + 1);

  const dp = lcs(a, b);
  const out: DiffLine[] = [];
  backtrack(dp, a, b, a.length, b.length, out, lLeft, lRight);
  return out;
}
