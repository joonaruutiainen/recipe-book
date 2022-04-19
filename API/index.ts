import express, { Express } from 'express';
import cors from 'cors';
import config from 'config';
import { ServerConfig, MongoDBConfig } from './config/types';
import db from './models/db';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import recipeRouter from './routes/recipes';

const dbConfig: MongoDBConfig = config.get('mongoDb');
const serverConfig: ServerConfig = config.get('server');

db.connectDb(dbConfig);

const app: Express = express();

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

app.listen(serverConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[API] Server is running at https://localhost:${serverConfig.port}`);
});

const cleanup = () => {
  db.disconnectDb();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
