import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import recipeRouter from './routes/recipes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: 'http://localhost:3000',
    allowedHeaders: 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization',
    credentials: true,
  })
);

app.use(express.json());

const apiUrl = '/api/v1';
app.use(apiUrl, authRouter);
app.use(`${apiUrl}/users`, userRouter);
app.use(`${apiUrl}/recipes`, recipeRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[API]: Server is running at https://localhost:${port}`);
});
