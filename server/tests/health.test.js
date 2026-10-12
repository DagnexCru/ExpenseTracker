import http from 'http';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import mongoose from 'mongoose';

const testHealthEndpoint = async () => {
  console.log('[Test] Connecting to database...');
  await connectDB();

  const testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(5001, resolve));
  console.log('[Test] Test server listening on http://localhost:5001');

  try {
    const response = await fetch('http://localhost:5001/api/health');
    const data = await response.json();

    console.log('[Test] Health endpoint response status:', response.status);
    console.log('[Test] Health response payload:\n', JSON.stringify(data, null, 2));

    if (response.status === 200 && data.success === true && data.status === 'healthy') {
      console.log('✅ PASS: /api/health endpoint is fully functional and reports healthy database connection!');
    } else {
      console.error('❌ FAIL: Health check did not return expected healthy status');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('❌ FAIL: Exception during health check test:', error.message);
    process.exitCode = 1;
  } finally {
    testServer.close();
    await mongoose.connection.close();
    console.log('[Test] Test server and database connection closed cleanly.');
  }
};

testHealthEndpoint();
