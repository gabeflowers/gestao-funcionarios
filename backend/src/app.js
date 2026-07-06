import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

const allowedOrigin = process.env.FRONTEND_URL ?? '*';

app.use(cors({ origin: allowedOrigin }));

app.use(express.json());

app.use('/api/employees', employeeRoutes);

app.use(errorHandler);