import { describe, expect, it } from "vitest";
import { convertCryptoToFiat, convertFiatToCrypto } from "./converter";

describe("converter calculations", () => {
  it("converts crypto to fiat and back", () => {
    expect(convertCryptoToFiat(2, 100, 0.9)).toBe(180);
    expect(convertFiatToCrypto(180, 100, 0.9)).toBe(2);
  });

  it("handles zero and missing prices safely", () => {
    expect(convertCryptoToFiat(0, 100, 1)).toBe(0);
    expect(convertCryptoToFiat(1, null, 1)).toBeNull();
  });

  it("rejects invalid amounts", () => {
    expect(() => convertFiatToCrypto(-1, 100, 1)).toThrow("Amount");
  });
});
