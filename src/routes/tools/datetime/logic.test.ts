import { describe, it, expect } from "vitest";
import {
  parseTimestamp,
  parseCron,
  nextCronExecutions,
  diffDates,
  addToDate,
  sumHours,
  computeCountdown,
} from "./logic";

describe("parseTimestamp", () => {
  it("parses unix timestamp", () => {
    const r = parseTimestamp("1609459200");
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.unix).toBe(1609459200);
      expect(r.iso).toBe("2021-01-01T00:00:00.000Z");
    }
  });

  it("returns error for invalid input", () => {
    const r = parseTimestamp("not a date");
    expect("error" in r).toBe(true);
  });
});

describe("parseCron", () => {
  it("parses valid cron expression", () => {
    const r = parseCron("*/5 * * * *");
    expect("error" in r).toBe(false);
  });

  it("rejects wrong number of fields", () => {
    const r = parseCron("* * *");
    expect("error" in r).toBe(true);
  });
});

describe("nextCronExecutions", () => {
  it("returns future dates for a valid expression", () => {
    const dates = nextCronExecutions("0 9 * * *", 3);
    expect(dates.length).toBe(3);
    dates.forEach((d) => {
      expect(d.getMinutes()).toBe(0);
      expect(d.getHours()).toBe(9);
    });
  });
});

describe("diffDates", () => {
  it("computes date difference", () => {
    const r = diffDates("2020-01-01", "2021-01-01");
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.years).toBe(1);
      expect(r.totalDays).toBe(366);
    }
  });

  it("rejects invalid dates", () => {
    const r = diffDates("invalid", "2021-01-01");
    expect("error" in r).toBe(true);
  });
});

describe("addToDate", () => {
  it("adds days to a date", () => {
    expect(addToDate("2021-01-01", 5, 0, 0)).toBe("2021-01-06");
  });

  it("adds months", () => {
    expect(addToDate("2021-01-01", 0, 1, 0)).toBe("2021-02-01");
  });

  it("rejects invalid date", () => {
    const r = addToDate("bad", 0, 0, 0);
    expect(typeof r).toBe("object");
    expect("error" in (r as object)).toBe(true);
  });
});

describe("sumHours", () => {
  it("sums positive hours", () => {
    const r = sumHours(["8:30", "7:45"]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.total).toBe("16:15");
  });

  it("rejects invalid format", () => {
    const r = sumHours(["not time"]);
    expect(r.ok).toBe(false);
  });
});

describe("computeCountdown", () => {
  it("detects a past date as done", () => {
    expect(computeCountdown("2020-01-01T00:00:00Z").done).toBe(true);
  });

  it("computes future countdown", () => {
    const future = new Date(Date.now() + 100000).toISOString();
    const r = computeCountdown(future);
    expect(r.done).toBe(false);
    expect(r.total).toBeGreaterThan(0);
  });
});
