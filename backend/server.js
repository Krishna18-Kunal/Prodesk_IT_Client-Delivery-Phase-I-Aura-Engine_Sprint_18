import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './src/config/database.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') ?? 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/api/health', (_req, res) => res.json({
  success: true,
  message: 'Aura Engine API is running',
  environment: process.env.NODE_ENV ?? 'development',
  timestamp: new Date().toISOString(),
}));
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
connectDatabase()
  .then(() => app.listen(port, () => console.log(`Aura Engine API listening on ${port}`)))
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
