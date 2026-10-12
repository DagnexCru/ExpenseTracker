import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    System health check returning server uptime, environment, and DB status
 * @access  Public
 */
router.get('/', (req, res) => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbStateCode = mongoose.connection.readyState;
  const dbStatus = stateMap[dbStateCode] || 'unknown';
  const isHealthy = dbStateCode === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: true,
    status: isHealthy ? 'healthy' : 'degraded',
    message: isHealthy
      ? 'SpendWise API and Database are operational'
      : 'SpendWise API operational, but database connection is degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: 'online',
      database: {
        status: dbStatus,
        readyState: dbStateCode,
        host: mongoose.connection.host || null,
        name: mongoose.connection.name || null,
      },
    },
  });
});

export default router;
