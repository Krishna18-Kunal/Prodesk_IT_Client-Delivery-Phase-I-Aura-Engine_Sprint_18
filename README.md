# Aura Engine — Enterprise Inventory & Analytics MVP

A commercial-style full-stack inventory dashboard built with React + Vite, Node.js + Express, MongoDB/Mongoose, Zod, and Recharts. All data is synthetic. The public project name is **Aura Engine**; do not publish the confidential client name or real client data.

## Architecture

- `backend/`: REST API, Mongoose model/indexes, controllers, Zod validation, 50,000-record seeder.
- `frontend/`: React dashboard, debounced search, server-side pagination, filters, sorting, charts, CSV export.
- API health: `GET /api/health`
- Inventory: `GET /api/inventory?page=1&limit=50&search=laptop&category=Electronics&maxStock=20&minPrice=10&maxPrice=500&sort=-price`
- Analytics: `GET /api/analytics`
- Categories: `GET /api/inventory/categories`
- CRUD: `POST /api/inventory`, `PUT /api/inventory/:id`, `DELETE /api/inventory/:id`

## Requirements

- Node.js 20+
- MongoDB 6+ (local MongoDB or MongoDB Atlas)
- npm

## 1. Configure and run backend

```bash
cd backend
cp .env.example .env
# Set MONGODB_URI and optionally PORT / CORS_ORIGIN
npm install
npm run seed
npm run dev
```

The seeder inserts 50,000 synthetic products in batches. It clears only the collection configured by `MONGODB_URI` before inserting. **Never run the seeder against a production database containing real data.**

Backend defaults to `http://localhost:5000`.

## 2. Run frontend

Open a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend calls `VITE_API_URL` (default `http://localhost:5000/api`).

## 3. Verify API with Postman

1. `GET http://localhost:5000/api/health`
2. `GET http://localhost:5000/api/inventory?search=laptop&limit=5`
3. `GET http://localhost:5000/api/analytics`
4. Try invalid data with `POST /api/inventory`, e.g. `{ "productName":"Bad item", "sku":"BAD-001", "category":"Electronics", "price":5, "cost":10, "stockQuantity":4, "reorderLevel":2 }`. It should return HTTP 400 because price is below cost.

## API contract

### Inventory query parameters
- `page`: positive integer, default 1
- `limit`: 1–1000, default 50 (UI uses 50)
- `search`: MongoDB text search across product name, SKU and category
- `category`: exact category
- `maxStock`: maximum stock quantity
- `minPrice`, `maxPrice`: inclusive price bounds
- `sort`: allow-listed field, optionally prefixed with `-`; e.g. `-price`, `productName`, `stockQuantity`

Response:
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "totalRecords": 50000,
    "totalPages": 1000,
    "currentPage": 1,
    "hasNextPage": true,
    "limit": 50
  }
}
```

Analytics response contains `summary`, `restockPriority` (10 lowest-stock products), and `categoryValuation` (sum of price × stock by category). The server performs the calculations in MongoDB; it does not load all products into Node memory.

## Performance and production notes

- Individual indexes exist for `sku`, `category`, and `productName`; compound text index supports search. SKU is unique.
- Pagination is server-side. The UI requests 50 rows per page.
- Search debounce is 500 ms and stale requests are cancelled.
- API validates pagination, sorting and numeric filters; sort fields are allow-listed.
- CSV export downloads every matching record in chunks (up to 1,000 per request) using the active filters, not only the current page.
- For production, add authentication/authorization, rate limiting, audit logging, monitoring, backups, HTTPS, secret management, and load tests. This MVP intentionally does not pretend those enterprise controls are already implemented.
- Regex/substring search and unbounded exports are intentionally avoided. MongoDB text search is token-based; test real search expectations and tune indexes with `explain("executionStats")`.
- Analytics is computed with aggregation pipelines. For very high write volume, consider pre-aggregated/materialized analytics and caching.

## Deployment outline

### Backend (Render / Railway / similar)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add `MONGODB_URI`, `CORS_ORIGIN` (your deployed frontend URL), and `NODE_ENV=production`.
- Do not commit `.env`.

### Frontend (Vercel)
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`.
- Redeploy after environment changes.

## Demo video (3–5 minutes)
1. Explain the operational problem and business value.
2. Show the dashboard KPIs and charts.
3. Open DevTools Network and show each page request returns 50 rows.
4. Search for `laptop`; explain the 500 ms debounce and server-side search.
5. Apply category, stock and price filters; sort by price.
6. Export CSV and open it.
7. In Postman, show `?search=laptop&limit=5`, analytics response/time, and invalid POST returning 400.
8. State that the dataset is synthetic and the MVP requires security hardening before handling real client data.

## Project structure

```text
aura-engine/
├── backend/
│   ├── src/{config,controllers,middleware,models,routes,utils}
│   ├── scripts/seed.js
│   └── server.js
├── frontend/
│   └── src/{components,hooks,services}
├── Prompts.md
└── README.md
```
