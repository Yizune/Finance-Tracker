import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/connection';
import { extractUser } from './middleware/auth';

import transactionRoutes from './routes/transactionRoutes';
import categoriesRoutes from './routes/categoriesRoutes';
import settingsRoutes from './routes/settingsRoutes';

dotenv.config({ path: './server/.env' });

const app = express();
const PORT = process.env.PORT ?? 5002;

app.use(cors());
app.use(express.json());
app.use(extractUser);

app.use('/transactions', transactionRoutes);
app.use('/categories', categoriesRoutes);
app.use('/settings', settingsRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

export default app;
