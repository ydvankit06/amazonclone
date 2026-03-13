import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { testConnection } from './config/db.js';
import { seedExampleData } from './utils/seedExampleData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

async function start() {
  try {
    await testConnection();
    // eslint-disable-next-line no-console
    console.log('Connected to PostgreSQL');
    await seedExampleData();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

