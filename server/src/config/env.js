import dotenv from 'dotenv';
dotenv.config();

const requiredEnvs = ['MONGO_URI', 'JWT_SECRET'];

for (const key of requiredEnvs) {
  if (!process.env[key]) {
    throw new Error(`Missing critical environment variable: ${key}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
};