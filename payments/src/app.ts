import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser'
import { NotFoundError, errorHandler, currentUser } from '@micro_tickets/common';
import cors from "cors";
import { CreateChargeRouter } from './routes/create-charge';

const app = express();
const corsOptions: cors.CorsOptions = {
  origin: `${process.env.CLIENT_URL}`, // Update with your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(currentUser);
app.use(CreateChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route is Not Found');
});
app.use(errorHandler);


export { app }