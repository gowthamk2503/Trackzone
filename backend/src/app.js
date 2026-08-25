import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import geofenceRoutes from './routes/geofenceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import holidayRoutes from './routes/holidayRoutes.js';
import webauthnRoutes from './routes/webauthnRoutes.js';

export const createApp = () => {
  const app = express();

  // Trust reverse proxy (Render, Vercel, Cloudflare, AWS)
  app.set('trust proxy', 1);

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  // CORS Middleware - Support Vercel deployments, localhost, and custom client URLs with credentials
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        
        // Dynamically allow Vercel domains, localhost, or configured CLIENT_URL
        const isAllowed =
          origin.includes('localhost') ||
          origin.includes('127.0.0.1') ||
          origin.endsWith('.vercel.app') ||
          origin === process.env.CLIENT_URL ||
          process.env.CLIENT_URL === '*';

        if (isAllowed) {
          return callback(null, true);
        }
        return callback(null, true); // Fallback allow origin with credentials
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      exposedHeaders: ['Set-Cookie'],
      optionsSuccessStatus: 200,
    })
  );

  // Handle preflight requests globally
  app.options('*', cors());

  // Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP Request Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Apply General Rate Limiter to API routes
  app.use('/api', apiLimiter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'TrackZone Enterprise Attendance Engine',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Mount API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/geofence', geofenceRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/leaves', leaveRoutes);
  app.use('/api/holidays', holidayRoutes);
  app.use('/api/webauthn', webauthnRoutes);

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
