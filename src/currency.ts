/** Currency helpers: amount-in-words (Indian numbering) and INR formatting. */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

/** Convert 1-99 to words. */
function twoDigitsToWords(n: number): string {
  if (n < 20) return ONES[n]!;
  const t = TENS[Math.floor(n / 10)]!;
  const o = n % 10;
  return o ? `${t} ${ONES[o]}` : t;
}

/**
 * Convert a non-negative integer to words using the Indian numbering system
 * (thousand, lakh, crore).
 *
 * @example numberToIndianWords(125000) // => "One Lakh Twenty Five Thousand"
 */
export function numberToIndianWords(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('value must be a non-negative finite number');
  }
  let num = Math.floor(value);
  if (num === 0) return 'Zero';

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  num %= 100;

  const parts: string[] = [];
  // Crore can itself exceed 99 (e.g. 100+ crore), so recurse for that segment.
  if (crore) parts.push(`${numberToIndianWords(crore)} Crore`);
  if (lakh) parts.push(`${twoDigitsToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigitsToWords(thousand)} Thousand`);
  if (hundred) parts.push(`${ONES[hundred]} Hundred`);
  if (num) parts.push(twoDigitsToWords(num));

  return parts.join(' ');
}

export interface AmountInWordsOptions {
  /** Currency label for the whole part. Default 'Rupees'. */
  currency?: string;
  /** Sub-unit label. Default 'Paise'. */
  subCurrency?: string;
  /** Append 'Only' at the end. Default true. */
  suffixOnly?: boolean;
}

/**
 * Convert a monetary amount to words, e.g. for printing on an invoice.
 *
 * @example
 * amountInWords(125000.5)
 * // => "One Lakh Twenty Five Thousand Rupees and Fifty Paise Only"
 */
export function amountInWords(amount: number, options: AmountInWordsOptions = {}): string {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('amount must be a non-negative finite number');
  }
  const { currency = 'Rupees', subCurrency = 'Paise', suffixOnly = true } = options;

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = `${numberToIndianWords(rupees)} ${currency}`;
  if (paise > 0) {
    words += ` and ${numberToIndianWords(paise)} ${subCurrency}`;
  }
  if (suffixOnly) words += ' Only';
  return words;
}

/**
 * Format a number as Indian Rupees with the Indian digit grouping
 * (e.g. 1,25,000.00).
 *
 * @example formatINR(125000) // => "₹1,25,000.00"
 */
export function formatINR(
  amount: number,
  options: { symbol?: boolean; decimals?: number } = {},
): string {
  const { symbol = true, decimals = 2 } = options;
  if (!Number.isFinite(amount)) {
    throw new Error('amount must be a finite number');
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  return symbol ? `₹${formatted}` : formatted;
}
