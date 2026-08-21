export const DEFAULT_TAX_RATE = 19;

export type QuoteStatus =
  | "draft"
  | "issued"
  | "accepted"
  | "expired"
  | "void";

export type PriceMode = "standard" | "offer";

export interface QuoteLineInput {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unitPrice: number;
  standardPrice?: number;
  offerPrice?: number;
}

export interface QuoteLineTotals {
  net: number;
  tax: number;
  total: number;
}

export interface QuoteTotals extends QuoteLineTotals {
  itemCount: number;
}

/**
 * Normalizes a monetary input to a non-negative CLP integer.
 *
 * @param value - Candidate amount received from a form or persisted record.
 * @returns A safe integer amount in CLP.
 * @throws {RangeError} When the value is negative, non-finite or unsafe.
 */
export function toClpInteger(value: number): number {
  const normalized = Math.round(value);

  if (!Number.isFinite(value) || normalized < 0 || !Number.isSafeInteger(normalized)) {
    throw new RangeError("El monto debe ser un entero CLP válido y no negativo.");
  }

  return normalized;
}

/**
 * Calculates one quote line using deterministic integer rounding.
 * IVA is rounded on each line to preserve the Excel model's audit rule.
 *
 * @param line - Quantity and unit price snapshot for the quote line.
 * @param taxRate - Chilean tax percentage applied to the line.
 * @returns Net, tax and gross totals expressed as CLP integers.
 */
export function calculateLine(
  line: Pick<QuoteLineInput, "quantity" | "unitPrice">,
  taxRate = DEFAULT_TAX_RATE,
): QuoteLineTotals {
  if (!Number.isFinite(line.quantity) || line.quantity < 0) {
    throw new RangeError("La cantidad debe ser un número no negativo.");
  }

  if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
    throw new RangeError("La tasa de impuesto debe estar entre 0 y 100.");
  }

  const unitPrice = toClpInteger(line.unitPrice);
  const net = toClpInteger(line.quantity * unitPrice);
  const tax = toClpInteger((net * taxRate) / 100);

  return { net, tax, total: net + tax };
}

/**
 * Reconciles quote totals by summing already-rounded line amounts.
 *
 * @param lines - Quote lines to total.
 * @param taxRate - Tax percentage used by every line.
 * @returns Reconciled CLP totals and total quantity.
 */
export function calculateQuote(
  lines: QuoteLineInput[],
  taxRate = DEFAULT_TAX_RATE,
): QuoteTotals {
  return lines.reduce<QuoteTotals>(
    (accumulator, line) => {
      const totals = calculateLine(line, taxRate);

      return {
        net: accumulator.net + totals.net,
        tax: accumulator.tax + totals.tax,
        total: accumulator.total + totals.total,
        itemCount: accumulator.itemCount + line.quantity,
      };
    },
    { net: 0, tax: 0, total: 0, itemCount: 0 },
  );
}

/** Formats an integer amount using Chilean peso conventions. */
export function formatClp(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Selects the corresponding catalog price without mutating its snapshot. */
export function priceForMode(line: QuoteLineInput, mode: PriceMode): number {
  const fallback = line.unitPrice;
  return mode === "offer"
    ? (line.offerPrice ?? fallback)
    : (line.standardPrice ?? fallback);
}
