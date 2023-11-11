import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { config } from './config/config';
import { Endpoints } from './config/endpoints';
import { errorHandler } from './errors';
import { mainRouter } from './routes/main.routes';
import { Logger } from './logger';
import path from 'path';

const { PORT } = config;
const { API } = Endpoints;

const app: Application = express();

app.use(express.static(path.join(__dirname, '../public/assets/uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// _______________________________Process Routes_________________________________________________
app.use(API, mainRouter);

// _______________________________ Send 404 not found for unknown routes_________________________
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('this request is not found!');
  next();
});

// ________________________________Handle errors_________________________________________________
app.use(errorHandler);

// _________________________________Serve_________________________________________________________
app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
});
