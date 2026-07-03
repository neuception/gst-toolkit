# gst-toolkit

[![npm version](https://img.shields.io/npm/v/@neuception/gst-toolkit.svg)](https://www.npmjs.com/package/@neuception/gst-toolkit)
[![license](https://img.shields.io/npm/l/@neuception/gst-toolkit.svg)](./LICENSE)

Zero-dependency TypeScript toolkit for **Indian GST**:

- ✅ **GSTIN validation** — structure, state code, official checksum, holder type, masking
- 🆔 **PAN validation** — structure + holder-type detection
- 🧮 **GST calculation** — inclusive/exclusive amounts with CGST/SGST/IGST split + round-off
- 🔤 **Amount in words** — Indian numbering system (lakh/crore), ready for invoices
- 💸 **INR formatting** — correct Indian digit grouping (`₹1,25,000.00`)
- 📅 **Financial year** — Indian FY / assessment-year helpers

Fully typed, tree-shakeable, ESM + CJS, no runtime dependencies.

> Built and maintained alongside **[GSTInvoicePDF.com](https://gstinvoicepdf.com)** — a free GST invoice generator for Indian businesses. Try the live [GST calculator](https://gstinvoicepdf.com/gst-calculator) and [HSN/SAC finder](https://gstinvoicepdf.com/hsn-sac-finder).

## Install

```bash
npm install @neuception/gst-toolkit
```

## Usage

```ts
import {
  validateGSTIN,
  isValidGSTIN,
  getStateFromGSTIN,
  calculateGST,
  amountInWords,
  formatINR,
} from '@neuception/gst-toolkit';
```

### GSTIN validation

```ts
isValidGSTIN('27AAPFU0939F1ZV'); // => true

validateGSTIN('27AAPFU0939F1ZV');
// => {
//   valid: true,
//   stateCode: '27',
//   state: 'Maharashtra',
//   pan: 'AAPFU0939F'
// }

validateGSTIN('27AAPFU0939F1ZX');
// => { valid: false, reason: 'Checksum digit does not match', ... }

getStateFromGSTIN('29AAGCB7383J1Z5'); // => 'Karnataka'

maskGSTIN('27AAPFU0939F1ZV'); // => '27XXXXXXXX9F1ZV'  (safe for display)
```

### PAN validation

```ts
isValidPAN('AAPFU0939F'); // => true

validatePAN('ABCPD1234E');
// => { valid: true, holderType: 'Individual' }   // 4th char encodes the type

getPANHolderType('ABCCD1234E'); // => 'Company'
```

Validation checks the 15-character structure, a recognised state code, **and** the
GSTN check digit — so typos and fabricated numbers are caught, not just format errors.

### GST calculation

```ts
// Add 18% GST to a base amount (intra-state)
calculateGST({ amount: 1000, rate: 18 });
// => { base: 1000, gst: 180, total: 1180, cgst: 90, sgst: 90, igst: 0, interState: false, rate: 18 }

// Inter-state supply → IGST
calculateGST({ amount: 1000, rate: 18, interState: true });
// => { ..., cgst: 0, sgst: 0, igst: 180 }

// Reverse-calculate from a GST-inclusive price
calculateGST({ amount: 1180, rate: 18, type: 'inclusive' });
// => { base: 1000, gst: 180, total: 1180, ... }

// Just split a known GST amount
splitGST(180);       // => { cgst: 90, sgst: 90, igst: 0 }
splitGST(180, true); // => { cgst: 0, sgst: 0, igst: 180 }

// Round an invoice total to the nearest rupee (for the "Round Off" line)
roundOff(1180.6); // => { rounded: 1181, roundOff: 0.4 }
```

### Amount in words & INR formatting

```ts
amountInWords(125000.5);
// => 'One Lakh Twenty Five Thousand Rupees and Fifty Paise Only'

numberToIndianWords(10000000); // => 'One Crore'

formatINR(1234567.5);                 // => '₹12,34,567.50'
formatINR(1000, { symbol: false });   // => '1,000.00'
```

### Financial year

```ts
getFinancialYear(new Date(2026, 5, 15)); // => '2026-27'  (Indian FY: Apr–Mar)
getAssessmentYear(new Date(2026, 5, 15)); // => '2027-28'
getFinancialYearRange(new Date(2026, 5, 15));
// => { start: <1 Apr 2026>, end: <31 Mar 2027>, label: '2026-27' }
```

## API

| Function | Description |
| --- | --- |
| `validateGSTIN(gstin)` | Full validation → `{ valid, reason?, stateCode?, state?, pan?, holderType? }` |
| `isValidGSTIN(gstin)` | Boolean convenience check |
| `getStateFromGSTIN(gstin)` | State/UT name from the state code |
| `getPANFromGSTIN(gstin)` | Extract the embedded PAN |
| `maskGSTIN(gstin)` | Mask the middle for safe display |
| `computeGstinCheckDigit(first14)` | Compute the GSTN check digit |
| `validatePAN(pan)` | Full PAN validation → `{ valid, reason?, holderType? }` |
| `isValidPAN(pan)` | Boolean convenience check |
| `getPANHolderType(pan)` | Holder type from the 4th character |
| `calculateGST({ amount, rate, type?, interState? })` | Full GST breakdown |
| `splitGST(gstAmount, interState?)` | Split GST into CGST/SGST/IGST |
| `roundOff(amount)` | Nearest-rupee rounding + adjustment |
| `numberToIndianWords(n)` | Integer → Indian-system words |
| `amountInWords(amount, options?)` | Money → words with Rupees/Paise |
| `formatINR(amount, options?)` | Indian-grouped currency string |
| `getFinancialYear(date?)` | Indian FY as `"YYYY-YY"` |
| `getFinancialYearRange(date?)` | FY start/end dates + label |
| `getAssessmentYear(date?)` | Assessment year as `"YYYY-YY"` |

Also exported: `GST_STATE_CODES`, `GSTIN_REGEX`, `PAN_REGEX`, `PAN_HOLDER_TYPES`, and all TypeScript types.

## Notes

GST rates and rules change over time; this library provides calculation and
validation primitives, not tax advice. Always confirm rates and applicability
against the official [GST portal](https://www.gst.gov.in).

## License

MIT © [Mohit Sawhney](https://gstinvoicepdf.com)
