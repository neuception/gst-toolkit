import { describe, it, expect } from 'vitest';
import {
  validateGSTIN,
  isValidGSTIN,
  getStateFromGSTIN,
  getPANFromGSTIN,
  computeGstinCheckDigit,
} from './gstin';

describe('computeGstinCheckDigit', () => {
  it('produces the correct check digit for a known GSTIN prefix', () => {
    // 27AAPFU0939F1ZV is a well-formed GSTIN; the check digit for the first
    // 14 chars "27AAPFU0939F1Z" is "V".
    expect(computeGstinCheckDigit('27AAPFU0939F1Z')).toBe('V');
  });

  it('round-trips: a GSTIN built with its computed digit is valid', () => {
    const prefix = '29AAGCB7383J1Z';
    const gstin = prefix + computeGstinCheckDigit(prefix);
    expect(isValidGSTIN(gstin)).toBe(true);
  });
});

describe('validateGSTIN', () => {
  it('accepts a valid GSTIN and returns details', () => {
    const res = validateGSTIN('27AAPFU0939F1ZV');
    expect(res.valid).toBe(true);
    expect(res.stateCode).toBe('27');
    expect(res.state).toBe('Maharashtra');
    expect(res.pan).toBe('AAPFU0939F');
  });

  it('rejects a GSTIN with a wrong checksum', () => {
    const res = validateGSTIN('27AAPFU0939F1ZX');
    expect(res.valid).toBe(false);
    expect(res.reason).toMatch(/checksum/i);
  });

  it('rejects the wrong length', () => {
    expect(validateGSTIN('27AAPFU0939F1Z').valid).toBe(false);
  });

  it('rejects a bad format', () => {
    expect(validateGSTIN('ZZAAPFU0939F1ZV').valid).toBe(false);
  });

  it('rejects an unknown state code', () => {
    const res = validateGSTIN('00AAPFU0939F1ZV');
    expect(res.valid).toBe(false);
    expect(res.reason).toMatch(/state code/i);
  });

  it('is case-insensitive and trims whitespace', () => {
    expect(isValidGSTIN('  27aapfu0939f1zv  ')).toBe(true);
  });

  it('handles non-string input gracefully', () => {
    // @ts-expect-error testing runtime guard
    expect(validateGSTIN(null).valid).toBe(false);
  });
});

describe('helpers', () => {
  it('getStateFromGSTIN resolves the state', () => {
    expect(getStateFromGSTIN('29AAGCB7383J1Z5')).toBe('Karnataka');
  });

  it('getPANFromGSTIN extracts the PAN', () => {
    expect(getPANFromGSTIN('27AAPFU0939F1ZV')).toBe('AAPFU0939F');
  });
});
