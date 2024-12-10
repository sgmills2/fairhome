import cron from 'node-cron';
import { syncChicagoData } from './services/sync';

// Run sync every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Starting daily sync...');
  try {
    const result = await syncChicagoData();
    console.log('Sync complete:', result);
  } catch (error) {
    console.error('Cron sync error:', error);
  }
}); 