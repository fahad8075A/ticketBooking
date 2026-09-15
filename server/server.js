import dotenv from 'dotenv';
import dns from 'node:dns';

// 1. Load environment variables
dotenv.config();

// Custom DNS fallback: helpful for MongoDB Atlas SRV lookup errors
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
  } catch (err) {
    console.warn('DNS server configuration warning:', err.message);
  }
}

// Global error traps registered immediately
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// 2. Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'STRIPE_SECRET_KEY'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error(
    `Fatal Startup Error: Missing environment variables: ${missingVars.join(', ')}`
  );
  process.exit(1);
}

// Use Railway's injected port directly or fallback to 5000
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

async function startServer() {
  try {
    // 3. Dynamic imports moved INSIDE async function to avoid top-level await runner crashes
    const { default: app } = await import('./app.js');
    const { default: connectDB } = await import('./src/config/db.js');

    // 4. Connect to MongoDB
    console.log('Connecting to database...');
    await connectDB();
    console.log('MongoDB connected successfully.');

    // 5. Bind server to 0.0.0.0 (required by Railway / container platforms)
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`Ready for requests at http://0.0.0.0:${PORT}`);
    });

    // Graceful shutdown handling
    const shutdown = (signal) => {
      console.log(`\n${signal} received. Closing HTTP server gracefully...`);
      server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forced shutdown due to timed-out connections.');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();