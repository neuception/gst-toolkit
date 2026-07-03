/** Indian financial-year and assessment-year helpers. */

/**
 * The Indian financial year runs 1 April – 31 March. This returns the
 * financial year for a date in "YYYY-YY" form, e.g. a date in June 2026
 * gives "2026-27".
 */
export function getFinancialYear(date: Date = new Date()): string {
  const { start } = getFinancialYearRange(date);
  const startYear = start.getFullYear();
  const endShort = String(startYear + 1).slice(-2);
  return `${startYear}-${endShort}`;
}

/**
 * The start and end dates of the financial year containing `date`,
 * plus its "YYYY-YY" label.
 */
export function getFinancialYearRange(
  date: Date = new Date(),
): { start: Date; end: Date; label: string } {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = January, 3 = April
  const startYear = month >= 3 ? year : year - 1;
  const start = new Date(startYear, 3, 1); // 1 April
  const end = new Date(startYear + 1, 2, 31); // 31 March
  const label = `${startYear}-${String(startYear + 1).slice(-2)}`;
  return { start, end, label };
}

/**
 * The assessment year for a date — always the year after the financial
 * year (FY 2025-26 → AY 2026-27).
 */
export function getAssessmentYear(date: Date = new Date()): string {
  const { start } = getFinancialYearRange(date);
  const ayStart = start.getFullYear() + 1;
  return `${ayStart}-${String(ayStart + 1).slice(-2)}`;
}
