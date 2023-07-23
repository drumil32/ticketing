import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser'
import { NotFoundError, errorHandler, currentUser } from '@micro_tickets/common';
import cors from "cors";
import { createTicketRouter } from './routes/create-ticket';
import { showTicketRouter } from './routes/show-ticket';
import { showAllTicketsRouter } from './routes/show-all-tickets';
import { updateTicketRouter } from './routes/update-ticket';

const app = express();
const corsOptions: cors.CorsOptions = {
  origin: `${process.env.CLIENT_URL}`, // Update with your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(showAllTicketsRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route is Not Found');
});

app.use(errorHandler);

export { app }