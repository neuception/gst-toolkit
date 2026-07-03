import { describe, it, expect } from 'vitest';
import { numberToIndianWords, amountInWords, formatINR, roundOff } from './currency';

describe('numberToIndianWords', () => {
  it('handles zero', () => {
    expect(numberToIndianWords(0)).toBe('Zero');
  });

  it('converts using lakh/crore grouping', () => {
    expect(numberToIndianWords(125000)).toBe('One Lakh Twenty Five Thousand');
    expect(numberToIndianWords(10000000)).toBe('One Crore');
    expect(numberToIndianWords(9999999)).toBe(
      'Ninety Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine',
    );
  });

  it('handles amounts above 100 crore via recursion', () => {
    expect(numberToIndianWords(1250000000)).toBe('One Hundred Twenty Five Crore');
  });
});

describe('amountInWords', () => {
  it('formats rupees only', () => {
    expect(amountInWords(100)).toBe('One Hundred Rupees Only');
  });

  it('formats rupees and paise', () => {
    expect(amountInWords(125000.5)).toBe(
      'One Lakh Twenty Five Thousand Rupees and Fifty Paise Only',
    );
  });
});

describe('formatINR', () => {
  it('formats with Indian digit grouping', () => {
    expect(formatINR(125000)).toBe('₹1,25,000.00');
    expect(formatINR(1234567.5)).toBe('₹12,34,567.50');
  });

  it('can omit the symbol', () => {
    expect(formatINR(1000, { symbol: false })).toBe('1,000.00');
  });
});

describe('roundOff', () => {
  it('rounds up and reports a positive adjustment', () => {
    expect(roundOff(1180.6)).toEqual({ rounded: 1181, roundOff: 0.4 });
  });
  it('rounds down and reports a negative adjustment', () => {
    expect(roundOff(1180.4)).toEqual({ rounded: 1180, roundOff: -0.4 });
  });
  it('leaves whole rupees unchanged', () => {
    expect(roundOff(1180)).toEqual({ rounded: 1180, roundOff: 0 });
  });
});
