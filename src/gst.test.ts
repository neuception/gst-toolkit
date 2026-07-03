import { describe, it, expect } from 'vitest';
import { calculateGST, splitGST } from './gst';

describe('calculateGST', () => {
  it('adds GST on an exclusive amount (intra-state)', () => {
    const r = calculateGST({ amount: 1000, rate: 18 });
    expect(r).toMatchObject({ base: 1000, gst: 180, total: 1180, cgst: 90, sgst: 90, igst: 0 });
  });

  it('charges IGST for inter-state supplies', () => {
    const r = calculateGST({ amount: 1000, rate: 18, interState: true });
    expect(r).toMatchObject({ cgst: 0, sgst: 0, igst: 180, total: 1180 });
  });

  it('reverse-calculates an inclusive amount', () => {
    const r = calculateGST({ amount: 1180, rate: 18, type: 'inclusive' });
    expect(r.base).toBe(1000);
    expect(r.gst).toBe(180);
    expect(r.total).toBe(1180);
  });

  it('handles a 0% rate', () => {
    const r = calculateGST({ amount: 500, rate: 0 });
    expect(r).toMatchObject({ base: 500, gst: 0, total: 500 });
  });

  it('throws on invalid input', () => {
    expect(() => calculateGST({ amount: -1, rate: 18 })).toThrow();
    expect(() => calculateGST({ amount: 100, rate: -5 })).toThrow();
  });
});

describe('splitGST', () => {
  it('splits evenly for intra-state', () => {
    expect(splitGST(180)).toEqual({ cgst: 90, sgst: 90, igst: 0 });
  });

  it('assigns all to IGST for inter-state', () => {
    expect(splitGST(180, true)).toEqual({ cgst: 0, sgst: 0, igst: 180 });
  });

  it('keeps the halves summing to the total for odd amounts', () => {
    const { cgst, sgst } = splitGST(181.01);
    expect(Number((cgst + sgst).toFixed(2))).toBe(181.01);
  });
});
