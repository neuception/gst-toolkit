import { describe, it, expect } from 'vitest';
import { getFinancialYear, getFinancialYearRange, getAssessmentYear } from './date';

describe('getFinancialYear', () => {
  it('uses the April–March boundary', () => {
    expect(getFinancialYear(new Date(2026, 5, 15))).toBe('2026-27'); // June 2026
    expect(getFinancialYear(new Date(2026, 2, 15))).toBe('2025-26'); // March 2026
    expect(getFinancialYear(new Date(2026, 3, 1))).toBe('2026-27'); // 1 April 2026
    expect(getFinancialYear(new Date(2027, 0, 1))).toBe('2026-27'); // Jan 2027
  });
});

describe('getFinancialYearRange', () => {
  it('spans 1 April to 31 March with a label', () => {
    const r = getFinancialYearRange(new Date(2026, 5, 15));
    expect(r.label).toBe('2026-27');
    expect(r.start.getFullYear()).toBe(2026);
    expect(r.start.getMonth()).toBe(3); // April
    expect(r.start.getDate()).toBe(1);
    expect(r.end.getFullYear()).toBe(2027);
    expect(r.end.getMonth()).toBe(2); // March
    expect(r.end.getDate()).toBe(31);
  });
});

describe('getAssessmentYear', () => {
  it('is the year after the financial year', () => {
    expect(getAssessmentYear(new Date(2026, 5, 15))).toBe('2027-28'); // FY 2026-27 → AY 2027-28
    expect(getAssessmentYear(new Date(2026, 2, 15))).toBe('2026-27'); // FY 2025-26 → AY 2026-27
  });
});
