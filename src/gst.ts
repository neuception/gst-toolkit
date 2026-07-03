/** GST calculation utilities: inclusive/exclusive amounts and CGST/SGST/IGST split. */

export type GSTCalculationType = 'exclusive' | 'inclusive';

export interface GSTCalculationInput {
  /** The amount to calculate on. */
  amount: number;
  /** GST rate as a percentage, e.g. 18 for 18%. */
  rate: number;
  /**
   * 'exclusive' (default): `amount` is the base and GST is added on top.
   * 'inclusive': `amount` already contains GST and is reverse-calculated.
   */
  type?: GSTCalculationType;
  /**
   * true for inter-state supplies (charged as IGST),
   * false (default) for intra-state supplies (split into CGST + SGST).
   */
  interState?: boolean;
}

export interface GSTResult {
  /** Taxable value before GST. */
  base: number;
  /** Total GST amount. */
  gst: number;
  /** base + gst. */
  total: number;
  /** The rate applied (%). */
  rate: number;
  cgst: number;
  sgst: number;
  igst: number;
  interState: boolean;
}

/** Round to 2 decimal places, avoiding binary float artefacts. */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate GST for a given amount and rate.
 *
 * @example
 * calculateGST({ amount: 1000, rate: 18 })
 * // => { base: 1000, gst: 180, total: 1180, cgst: 90, sgst: 90, igst: 0, ... }
 */
export function calculateGST(input: GSTCalculationInput): GSTResult {
  const { amount, rate, type = 'exclusive', interState = false } = input;

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('amount must be a non-negative finite number');
  }
  if (!Number.isFinite(rate) || rate < 0) {
    throw new Error('rate must be a non-negative finite number');
  }

  let base: number;
  let total: number;

  if (type === 'inclusive') {
    total = amount;
    base = amount / (1 + rate / 100);
  } else {
    base = amount;
    total = amount * (1 + rate / 100);
  }

  const gst = total - base;

  base = round2(base);
  total = round2(total);
  const gstRounded = round2(gst);

  const half = round2(gstRounded / 2);

  return {
    base,
    gst: gstRounded,
    total,
    rate,
    cgst: interState ? 0 : half,
    sgst: interState ? 0 : round2(gstRounded - half),
    igst: interState ? gstRounded : 0,
    interState,
  };
}

/**
 * Split a GST amount into its components.
 *
 * @example splitGST(180) // => { cgst: 90, sgst: 90, igst: 0 }
 * @example splitGST(180, true) // => { cgst: 0, sgst: 0, igst: 180 }
 */
export function splitGST(
  gstAmount: number,
  interState = false,
): { cgst: number; sgst: number; igst: number } {
  if (!Number.isFinite(gstAmount) || gstAmount < 0) {
    throw new Error('gstAmount must be a non-negative finite number');
  }
  if (interState) {
    return { cgst: 0, sgst: 0, igst: round2(gstAmount) };
  }
  const half = round2(gstAmount / 2);
  return { cgst: half, sgst: round2(gstAmount - half), igst: 0 };
}
