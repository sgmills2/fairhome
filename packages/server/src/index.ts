import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('Environment variables loaded:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'set' : 'not set',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set',
  PORT: process.env.PORT
});

import express from 'express';
import cors from 'cors';
import { syncChicagoData } from './services/sync';
import './cron';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Sync endpoint
app.post('/api/sync', async (req, res) => {
  try {
    const result = await syncChicagoData();
    res.json(result);
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 