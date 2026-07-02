import { describe, it, expect } from "vitest";
import { parseCurl } from "./logic";

describe("parseCurl", () => {
  it("parses simple GET", () => {
    const r = parseCurl("curl https://api.example.com/users");
    expect(r.method).toBe("GET");
    expect(r.url).toBe("https://api.example.com/users");
    expect(r.headers).toEqual({});
    expect(r.body).toBeNull();
  });

  it("parses -X POST", () => {
    const r = parseCurl("curl -X POST https://api.example.com/users");
    expect(r.method).toBe("POST");
  });

  it("parses --request", () => {
    const r = parseCurl("curl --request DELETE https://api.example.com/users/1");
    expect(r.method).toBe("DELETE");
  });

  it("parses -H header", () => {
    const r = parseCurl("curl -H 'Authorization: Bearer token' https://api.example.com");
    expect(r.headers["Authorization"]).toBe("Bearer token");
  });

  it("parses multiple -H headers", () => {
    const r = parseCurl(
      "curl -H 'Content-Type: application/json' -H 'Accept: application/json' https://api.example.com"
    );
    expect(r.headers["Content-Type"]).toBe("application/json");
    expect(r.headers["Accept"]).toBe("application/json");
  });

  it("parses -d body", () => {
    const r = parseCurl(`curl -X POST -d '{"key":"value"}' https://api.example.com`);
    expect(r.body).toBe('{"key":"value"}');
    expect(r.method).toBe("POST");
  });

  it("infers POST when body present", () => {
    const r = parseCurl(`curl -d 'payload' https://api.example.com`);
    expect(r.method).toBe("POST");
  });

  it("parses -u auth", () => {
    const r = parseCurl("curl -u user:pass https://api.example.com");
    expect(r.headers["Authorization"]).toBe("Basic dXNlcjpwYXNz");
  });

  it("returns error for missing URL", () => {
    const r = parseCurl("curl -X GET");
    expect(r.error).toBeTruthy();
  });

  it("generates fetch code", () => {
    const r = parseCurl("curl https://api.example.com/data");
    expect(r.fetch).toContain("fetch('https://api.example.com/data'");
  });

  it("generates axios code", () => {
    const r = parseCurl("curl https://api.example.com/data");
    expect(r.axios).toContain("axios.get('https://api.example.com/data'");
  });

  it("generates fetch with headers", () => {
    const r = parseCurl("curl -H 'Authorization: Bearer t' https://api.example.com");
    expect(r.fetch).toContain("Authorization");
  });
});
