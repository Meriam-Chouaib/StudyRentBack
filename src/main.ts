import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { config } from './config/config';
import { Endpoints } from './config/endpoints';
import { mainRouter } from './routes/main.routes';

const { PORT } = config;
const { API } = Endpoints;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//----------------------Router---------------------------------------------------
app.use(API, mainRouter);

//----------------------redirect to 404 not found--------------------------------
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('this request is not found!');
  next();
});

//---------------------- Datasource connection-----------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


