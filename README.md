# ATLAS

Bangladesh-first travel booking (working name). Stays, day trips, and recreation with a Single / Family / Corporate Who lens.

**Not Darmelk.** No MLM, shares, matrix, or commission surfaces.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Client session for Who lens, compare tray (max 3), and guest bookings (localStorage)
- Mock payment (bKash / Nagad / card / bank)
- Printable voucher + Corporate invoice pages

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run build
```

## Verify (Family)

1. Home, search Cox's Bazar, dates 12-15 Sep, Who = Family, Search
2. Open Inani Cliff Suite, confirm all-in total BDT 28,400
3. Add a second stay to compare, open compare tray, Book
4. Guest details, payment method, Pay BDT 28,400
5. Confirmation, Download voucher, View in My trips

## Verify (Corporate)

1. Set Who = Corporate on Home search
2. Book a listing with Invoice ready
3. Step 2 shows Company name, Billing email, TIN/VAT
4. After pay, Download invoice PDF on confirmation / My trips

## QA should still check

- Cross-browser localStorage booking persistence (no real auth yet)
- Mobile sticky CTAs on detail + book
- Compare tray at 3-item cap and remove
- Book blockers: kids not allowed / invoice unavailable
- Pay button disabled until guest fields + method valid
- Empty browse / empty My trips copy
- Visual polish vs Designer mocks (accent coral #E11D48, nav only Stays / Day trips / Recreation)

## Out of v1

Flights, packages, host chat, loyalty, map-first browse, real payments, admin/vendor UI.

## Brand

Working name ATLAS — keep tokenizable for rename.
