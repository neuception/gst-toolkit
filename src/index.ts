/**
 * gst-toolkit — zero-dependency utilities for Indian GST.
 *
 * Maintained alongside https://gstinvoicepdf.com (free GST invoice generator).
 */

export {
  validateGSTIN,
  isValidGSTIN,
  getStateFromGSTIN,
  getPANFromGSTIN,
  computeGstinCheckDigit,
  GSTIN_REGEX,
  GST_STATE_CODES,
} from './gstin.js';
export type { GstinValidationResult } from './gstin.js';

export { calculateGST, splitGST } from './gst.js';
export type { GSTCalculationInput, GSTResult, GSTCalculationType } from './gst.js';

export { numberToIndianWords, amountInWords, formatINR } from './currency.js';
export type { AmountInWordsOptions } from './currency.js';
