/**
 * GSTIN (Goods and Services Tax Identification Number) utilities.
 *
 * A GSTIN is a 15-character identifier:
 *   - chars 1-2   : state code (numeric)
 *   - chars 3-12  : PAN of the taxpayer
 *   - char 13     : entity/registration number for the PAN within the state
 *   - char 14     : 'Z' by default
 *   - char 15     : checksum character
 */

/** Base-36 alphabet used for the GSTIN checksum. */
const CODEPOINT_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MOD = CODEPOINT_CHARS.length; // 36

/** Structural pattern for a GSTIN (does not verify the checksum). */
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/** GST state/UT codes mapped to their names. */
export const GST_STATE_CODES: Record<string, string> = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman and Diu',
  '26': 'Dadra and Nagar Haveli and Daman and Diu',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh (Before Division)',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
  '99': 'Centre Jurisdiction',
};

/**
 * Compute the GSTIN checksum character for the first 14 characters of a GSTIN.
 * Implements the official GSTN check-digit algorithm.
 */
export function computeGstinCheckDigit(first14: string): string {
  const value = first14.toUpperCase();
  let factor = 2;
  let sum = 0;

  for (let i = value.length - 1; i >= 0; i--) {
    const codePoint = CODEPOINT_CHARS.indexOf(value[i]!);
    if (codePoint < 0) {
      throw new Error(`Invalid character "${value[i]}" in GSTIN`);
    }
    let addend = factor * codePoint;
    factor = factor === 2 ? 1 : 2;
    addend = Math.floor(addend / MOD) + (addend % MOD);
    sum += addend;
  }

  const checkCodePoint = (MOD - (sum % MOD)) % MOD;
  return CODEPOINT_CHARS[checkCodePoint]!;
}

export interface GstinValidationResult {
  valid: boolean;
  /** Reason for failure when `valid` is false. */
  reason?: string;
  /** Two-digit state code, when structurally present. */
  stateCode?: string;
  /** State/UT name, when the code is recognised. */
  state?: string;
  /** The 10-character PAN embedded in the GSTIN. */
  pan?: string;
}

/**
 * Validate a GSTIN's structure, state code, and checksum.
 * Returns a detailed result object.
 */
export function validateGSTIN(gstin: string): GstinValidationResult {
  if (typeof gstin !== 'string') {
    return { valid: false, reason: 'GSTIN must be a string' };
  }
  const value = gstin.trim().toUpperCase();

  if (value.length !== 15) {
    return { valid: false, reason: 'GSTIN must be exactly 15 characters' };
  }
  if (!GSTIN_REGEX.test(value)) {
    return { valid: false, reason: 'GSTIN format is invalid' };
  }

  const stateCode = value.slice(0, 2);
  if (!(stateCode in GST_STATE_CODES)) {
    return { valid: false, reason: `Unknown state code "${stateCode}"`, stateCode };
  }

  const expected = computeGstinCheckDigit(value.slice(0, 14));
  if (expected !== value[14]) {
    return {
      valid: false,
      reason: 'Checksum digit does not match',
      stateCode,
      state: GST_STATE_CODES[stateCode],
      pan: value.slice(2, 12),
    };
  }

  return {
    valid: true,
    stateCode,
    state: GST_STATE_CODES[stateCode],
    pan: value.slice(2, 12),
  };
}

/** Convenience boolean check for a GSTIN. */
export function isValidGSTIN(gstin: string): boolean {
  return validateGSTIN(gstin).valid;
}

/** Return the state/UT name for a GSTIN, or undefined if not resolvable. */
export function getStateFromGSTIN(gstin: string): string | undefined {
  if (typeof gstin !== 'string' || gstin.length < 2) return undefined;
  return GST_STATE_CODES[gstin.trim().slice(0, 2)];
}

/** Extract the PAN embedded in a GSTIN, or undefined if malformed. */
export function getPANFromGSTIN(gstin: string): string | undefined {
  if (typeof gstin !== 'string' || gstin.trim().length !== 15) return undefined;
  return gstin.trim().toUpperCase().slice(2, 12);
}
