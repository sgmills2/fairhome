import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { syncChicagoData } from './services/sync';
import './cron';

dotenv.config();

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