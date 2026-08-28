import { describe, expect, it } from "vitest";
import { nextPlatformColor, PLATFORM_COLORS } from "@/features/investments/data/investments.constants";

describe("nextPlatformColor", () => {
  it("assigns colors in order for the first platforms", () => {
    expect(nextPlatformColor(0)).toBe("chart-1");
    expect(nextPlatformColor(1)).toBe("chart-2");
    expect(nextPlatformColor(4)).toBe("chart-5");
  });

  it("cycles back to the first color once all are used", () => {
    expect(nextPlatformColor(PLATFORM_COLORS.length)).toBe("chart-1");
    expect(nextPlatformColor(PLATFORM_COLORS.length + 1)).toBe("chart-2");
  });
});
