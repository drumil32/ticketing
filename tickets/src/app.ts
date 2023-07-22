import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser'
import {NotFoundError,errorHandler} from '@micro_tickets/common';
import cors from "cors";
import { createTicketRouter } from './routes/create-ticket';

const app = express();
const corsOptions: cors.CorsOptions = {
  origin: `${process.env.CLIENT_URL}`, // Update with your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(createTicketRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }