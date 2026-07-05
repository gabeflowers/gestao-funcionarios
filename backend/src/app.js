import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/employees', employeeRoutes);

app.use(errorHandler);