import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { config } from './config/config';
import { Endpoints } from './config/endpoints';
import { errorHandler } from './errors';
import { mainRouter } from './routes/main.routes';
import { Logger } from './logger';

const { PORT } = config;
const { API } = Endpoints;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// Process Routes
app.use(API, mainRouter);

// Send 404 not found for unknown routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('this request is not found!');
  next();
});

// Handle errors
app.use(errorHandler);

// Serve
app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
});
