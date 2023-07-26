import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser'
import { NotFoundError, errorHandler, currentUser } from '@micro_tickets/common';
import cors from "cors";
import { showAllOrdersRouter } from './routes/show-all-orders';
import { showOrderRouter } from './routes/show-order';
import { deleteOrderRouter } from './routes/delete-order';
import { createOrderRouter } from './routes/create-order';

const app = express();
const corsOptions: cors.CorsOptions = {
  origin: `${process.env.CLIENT_URL}`, // Update with your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(currentUser);
app.use(showAllOrdersRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.use(createOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route is Not Found');
});

app.use(errorHandler);

export { app }