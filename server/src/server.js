import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 SpendWise API server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();
