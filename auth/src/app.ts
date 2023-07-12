import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser'
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { signUpRouter } from './routes/sign-up';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import cookieSession from 'cookie-session';

const app = express();

app.use(json());
app.use(
    cookieSession({
        signed: false,
    })
)
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async () => {
    throw new NotFoundError();
});
app.use(errorHandler);

export { app }