import dotenv from 'dotenv';
import dns from 'node:dns';

// 1. Load environment variables first
dotenv.config();

// Custom DNS servers for development (avoids DNS SRV query issues with MongoDB Atlas)
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

// 2. Validate critical environment variables before booting up
const requiredEnvVars = ['MONGO_URI', 'STRIPE_SECRET_KEY'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error(`Fatal Startup Error: Missing environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// 3. Dynamic imports to ensure process.env is fully loaded prior to module initialization
const { default: app } = await import('./app.js');
const { default: connectDB } = await import('./src/config/db.js');

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully.');

    // Bind server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`Ready for requests at http://localhost:${PORT}`);
    });

    // Graceful shutdown handling
    const shutdown = (signal) => {
      console.log(`\n${signal} received. Closing HTTP server gracefully...`);
      server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
      });

      // Force close if connections refuse to terminate within 10s
      setTimeout(() => {
        console.error('Forced shutdown due to timed-out active connections.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle global unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});

startServer();