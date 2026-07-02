import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "./logic";

describe("encrypt / decrypt", () => {
  it("roundtrips plaintext", async () => {
    const ct = await encrypt("hello world", "password123");
    const r = await decrypt(ct, "password123");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("hello world");
  });

  it("fails with wrong password", async () => {
    const ct = await encrypt("secret", "correct");
    const r = await decrypt(ct, "wrong");
    expect(r.ok).toBe(false);
  });

  it("handles empty plaintext", async () => {
    const ct = await encrypt("", "pass");
    const r = await decrypt(ct, "pass");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("");
  });

  it("rejects malformed payload", async () => {
    const r = await decrypt("garbage", "password");
    expect(r.ok).toBe(false);
  });
});
