import { describe, expect, it } from "vitest";
import { calculateLine, calculateQuote, formatClp } from "./quote";

describe("quote calculations", () => {
  it("rounds IVA per line and reconciles the gross total", () => {
    const first = calculateLine({ quantity: 3, unitPrice: 999 });
    const second = calculateLine({ quantity: 1, unitPrice: 1499 });
    const quote = calculateQuote([
      { id: "1", code: "A", description: "A", quantity: 3, unitPrice: 999 },
      { id: "2", code: "B", description: "B", quantity: 1, unitPrice: 1499 },
    ]);

    expect(first).toEqual({ net: 2997, tax: 569, total: 3566 });
    expect(second).toEqual({ net: 1499, tax: 285, total: 1784 });
    expect(quote).toEqual({ net: 4496, tax: 854, total: 5350, itemCount: 4 });
    expect(quote.total).toBe(quote.net + quote.tax);
  });

  it("formats amounts as Chilean pesos without decimals", () => {
    expect(formatClp(1499000)).toContain("1.499.000");
  });

  it("rejects negative monetary inputs", () => {
    expect(() => calculateLine({ quantity: 1, unitPrice: -1 })).toThrow(RangeError);
  });
});
