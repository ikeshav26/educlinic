import express, { type Request, type Response } from 'express';

const app: express.Application = express();

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

export default app;
