import { describe, expect, it } from "vitest";
import { digitsOnly, formatAmountInput } from "@/lib/format";

describe("digitsOnly", () => {
  it("strips everything that is not a digit", () => {
    expect(digitsOnly("1.500.000")).toBe("1500000");
    expect(digitsOnly("$1,234abc")).toBe("1234");
    expect(digitsOnly("")).toBe("");
  });
});

describe("formatAmountInput", () => {
  it("returns an empty string for empty input", () => {
    expect(formatAmountInput("")).toBe("");
  });

  it("formats digits with thousand separators (es-CO)", () => {
    expect(formatAmountInput("1500000")).toBe("1.500.000");
    expect(formatAmountInput("500")).toBe("500");
  });
});
