import { describe, it, expect } from 'vitest';
import { validatePAN, isValidPAN, getPANHolderType } from './pan';

describe('validatePAN', () => {
  it('accepts a valid individual PAN', () => {
    const r = validatePAN('AAPFU0939F');
    expect(r.valid).toBe(true);
    expect(r.holderType).toBe('Firm / LLP'); // 4th char 'F'
  });

  it('identifies an individual (P) holder', () => {
    expect(validatePAN('ABCPD1234E').holderType).toBe('Individual');
  });

  it('identifies a company (C) holder', () => {
    expect(validatePAN('ABCCD1234E').holderType).toBe('Company');
  });

  it('rejects a bad format', () => {
    expect(validatePAN('ABC1234567').valid).toBe(false);
    expect(validatePAN('AAPFU0939').valid).toBe(false);
  });

  it('rejects an unknown holder-type character', () => {
    // 4th char 'Z' is not a recognised holder type
    const r = validatePAN('ABCZD1234E');
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/holder-type/i);
  });

  it('is case-insensitive and trims', () => {
    expect(isValidPAN('  aapfu0939f  ')).toBe(true);
  });
});

describe('getPANHolderType', () => {
  it('returns the type name', () => {
    expect(getPANHolderType('ABCPD1234E')).toBe('Individual');
  });
  it('returns undefined for malformed input', () => {
    expect(getPANHolderType('nope')).toBeUndefined();
  });
});
