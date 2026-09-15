import dotenv from 'dotenv';
import dns from 'node:dns';

dotenv.config();

if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

// Dynamic imports ensure process.env is fully populated
const { default: app } = await import('./app.js');
const { default: connectDB } = await import('./src/config/db.js');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
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