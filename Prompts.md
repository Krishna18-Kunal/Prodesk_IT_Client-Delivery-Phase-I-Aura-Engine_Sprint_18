# AI Transparency Log — Aura Engine

This file records AI-assisted design work. Review, test, and understand every generated suggestion before submission.

## Prompt 1 — Backend architecture
"Design a modular Express/Mongoose inventory API for a synthetic 50,000-product dataset. Include server-side pagination, allow-listed sorting, category/price/stock filters, MongoDB indexes, and clear response metadata. Avoid loading the full collection into Node memory."

## Prompt 2 — MongoDB analytics
"Create MongoDB aggregation pipelines that calculate total SKU count, total inventory valuation using price × stockQuantity, out-of-stock count, ten lowest-stock products, and valuation grouped by category. Return compact data for KPI cards and Recharts."

## Prompt 3 — Debounced search
"Implement a React hook that waits 500 ms after the user's last keystroke, cancels stale fetches with AbortController, and exposes loading/error state."

## Prompt 4 — CSV export
"Implement browser-side CSV generation from all records matching the current filters. Fetch in bounded server-side pages, escape CSV fields correctly, create a Blob URL, trigger download, and revoke the URL."

## Engineering review checklist
- [ ] Confirm query behavior and index usage with MongoDB `explain("executionStats")`.
- [ ] Test page boundaries, empty results, invalid sort keys, and malformed ObjectIds.
- [ ] Test validation on both create and partial update.
- [ ] Test CSV quoting for commas, quotes, and newlines.
- [ ] Verify all 50,000 records are synthetic and no client data/secrets are present.
- [ ] Run frontend and backend builds before deployment.
- [ ] Add authentication, authorization, rate limiting, and audit controls before real commercial use.
