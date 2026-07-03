/** PAN (Permanent Account Number) utilities. */

/** Structural pattern for a PAN: 5 letters, 4 digits, 1 letter. */
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/**
 * The 4th character of a PAN encodes the type of holder.
 */
export const PAN_HOLDER_TYPES: Record<string, string> = {
  P: 'Individual',
  C: 'Company',
  H: 'Hindu Undivided Family (HUF)',
  F: 'Firm / LLP',
  A: 'Association of Persons (AOP)',
  T: 'Trust',
  B: 'Body of Individuals (BOI)',
  L: 'Local Authority',
  J: 'Artificial Juridical Person',
  G: 'Government',
};

export interface PanValidationResult {
  valid: boolean;
  reason?: string;
  /** Human-readable holder type derived from the 4th character. */
  holderType?: string;
}

/** Validate a PAN's structure and holder-type character. */
export function validatePAN(pan: string): PanValidationResult {
  if (typeof pan !== 'string') {
    return { valid: false, reason: 'PAN must be a string' };
  }
  const value = pan.trim().toUpperCase();

  if (value.length !== 10) {
    return { valid: false, reason: 'PAN must be exactly 10 characters' };
  }
  if (!PAN_REGEX.test(value)) {
    return { valid: false, reason: 'PAN format is invalid' };
  }

  const typeChar = value[3]!;
  const holderType = PAN_HOLDER_TYPES[typeChar];
  if (!holderType) {
    return { valid: false, reason: `Unknown holder-type character "${typeChar}"` };
  }

  return { valid: true, holderType };
}

/** Convenience boolean check for a PAN. */
export function isValidPAN(pan: string): boolean {
  return validatePAN(pan).valid;
}

/** Return the holder type for a PAN (e.g. "Company"), or undefined. */
export function getPANHolderType(pan: string): string | undefined {
  if (typeof pan !== 'string' || pan.trim().length !== 10) return undefined;
  return PAN_HOLDER_TYPES[pan.trim().toUpperCase()[3]!];
}
