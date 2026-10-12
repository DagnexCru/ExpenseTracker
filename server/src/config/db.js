import mongoose from 'mongoose';

/**
 * Connect to MongoDB database instance
 * Handles initial connection, connection events, and clean failure logging
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database name: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection lost. Attempting reconnect...');
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection error: ${error.message}`);
    // Do not crash server in dev so health checks can report DB status
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
