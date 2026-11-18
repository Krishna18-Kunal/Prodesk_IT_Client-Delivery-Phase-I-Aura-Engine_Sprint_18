
# Aura Engine — Inventory Management Dashboard

A full-stack inventory management dashboard built with **React, Vite, Node.js, Express, and MongoDB**. The application helps manage product inventory, explore records with server-side filtering and pagination, review inventory analytics, and export filtered data to CSV.

## Features

### Dashboard and Inventory
- Inventory overview with key inventory metrics.
- Product table backed by MongoDB.
- Server-side pagination.
- Debounced product search.
- Category, stock, and price filters.
- Sortable inventory columns.
- CSV export for filtered inventory.

### Analytics
- Inventory analytics using MongoDB aggregation pipelines.
- Dashboard visualizations using Recharts.
- API-driven analytics data.

### Backend
- Node.js and Express REST API.
- MongoDB with Mongoose.
- Product CRUD endpoints.
- Request validation with Zod.
- Centralized error handling.
- Helmet security headers, CORS configuration, and rate limiting.
- Seed script for generating 50,000 synthetic inventory products.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Validation | Zod |
| Development | npm, Git |

## Project Structure

```text
aura-engine/
├── backend/
│   ├── scripts/
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── Prompts.md
└── README.md
```

## Prerequisites

- Node.js (LTS version recommended)
- npm
- MongoDB Atlas or local MongoDB
- Git (optional)

## Local Setup

###  Configure Backend

```bash
cd backend
npm install
copy .env.example .env
```

Configure `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>/<DATABASE>?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173
```

For local MongoDB:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/aura_engine
```

Use your own database credentials. Never publish your `.env` file.

###  Seed Sample Inventory Data

From the backend directory:

```bash
npm run seed
```

The seed script replaces the documents in the configured products collection with 50,000 synthetic product records.

**Important:** Run this only against a dedicated development or test database. Never run it against production or a database containing data you need to keep.

###  Start Backend

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

###  Configure Frontend

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
```

Configure `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

###  Start Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## API Overview

Base URL:

```text
http://localhost:5000/api
```

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health check |
| GET | `/inventory` | List inventory |
| GET | `/inventory/categories` | Retrieve categories |
| GET | `/analytics` | Dashboard analytics |
| POST | `/inventory` | Create product |
| PUT | `/inventory/:id` | Update product |
| DELETE | `/inventory/:id` | Delete product |

Example:

```http
GET /api/inventory?page=1&limit=5&search=laptop
```

The inventory listing supports pagination, search, category, stock and price filters, and sorting. Refer to the backend route/controller implementation for exact accepted query parameter names and values.

## Testing Checklist

- [ ] Backend connects to MongoDB.
- [ ] Health endpoint returns success.
- [ ] Inventory API returns product records.
- [ ] Dashboard loads inventory data.
- [ ] Analytics page loads charts and metrics.
- [ ] Search works.
- [ ] Category, stock and price filters work.
- [ ] Sorting works.
- [ ] Pagination works.
- [ ] CSV export works.
- [ ] Product CRUD operations work.

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| PORT | Backend server port |
| NODE_ENV | Runtime environment |
| MONGODB_URI | MongoDB connection string |
| CORS_ORIGIN | Allowed frontend origin(s) |


Never put database credentials or private API keys in frontend variables prefixed with `VITE_`.

## Security and Production Readiness

- Keep `.env` files and secrets out of Git.
- Restrict MongoDB network access.
- Use a least-privilege database user.
- Configure production CORS with trusted origins only.
- Add authentication and role-based authorization before exposing write operations to real users.
- Add audit logging, backups and monitoring as required.
- Review dependency audit findings and update packages carefully.
- Test deployment settings under realistic load.
