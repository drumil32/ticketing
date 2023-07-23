import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser'
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { signUpRouter } from './routes/sign-up';
import { NotFoundError,errorHandler } from '@micro_tickets/common';
import session, { SessionOptions } from 'express-session';
import cors from "cors";

const app = express();
const corsOptions: cors.CorsOptions = {
  origin: `${process.env.CLIENT_URL}`, // Update with your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(cors());
declare module 'express-session' {
  interface SessionData {
    username?: string;
  }
}
import { Request, Response } from 'express';
// Set up session middleware
const sessionOptions: SessionOptions = {
  secret: 'your-secret-key', // Secret key used to sign the session ID cookie
  resave: true, // Don't save session if unmodified
  saveUninitialized: true, // Don't create session until something is stored
};

app.use(session(sessionOptions));
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError('Route is Not Found');
});
app.use(errorHandler);

export { app }