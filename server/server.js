import dotenv from 'dotenv';
import dns from 'node:dns';

// Load environment variables before importing modules that depend on process.env
dotenv.config();

// Custom DNS servers for MongoDB SRV resolution
dns.setServers(['1.1.1.1', '8.8.8.8']);

import app from './app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Ensure DB connects before accepting traffic
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();