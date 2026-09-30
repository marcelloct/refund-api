import cors from 'cors';
import express from 'express';
import { errorHandling } from './middlewares/errorHandling.js';
import { routes } from './routes/index.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);
app.use(errorHandling);

export { app };
