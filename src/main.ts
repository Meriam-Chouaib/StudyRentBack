import express, { Request, Response } from 'express';
import { config } from './config/config';

const { PORT } = config;

const app = express();

app.use('/hello', (request: Request, response: Response) => {
  console.log('Here i am!');
  response.status(200).send('Hello world!');
});

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
