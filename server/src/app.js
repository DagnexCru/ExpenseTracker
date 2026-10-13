import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import userRoutes from './routes/user.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import { securityHeaders, sanitizeNoSql } from './middleware/security.middleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Security hardening: Disable fingerprinting header
app.disable('x-powered-by');

// Apply OWASP Security Headers (nosniff, frame-options, xss, permissions)
app.use(securityHeaders);

// HTTP request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// CORS configuration supporting credentials (cookies)
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body & Cookie parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Anti-NoSQL Query Injection sanitizer
app.use(sanitizeNoSql);

// Base root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SpendWise API',
    version: '1.0.0',
    description: 'Personal Expense Tracker Backend API',
    documentation: '/api/health',
  });
});

// Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
