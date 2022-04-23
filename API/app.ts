import express, { Express } from 'express';
import cors from 'cors';
import config from 'config';
import { MongoDBConfig, ServerConfig } from './config/types';
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

app.use(serverConfig.apiUrl, authRouter);
app.use(`${serverConfig.apiUrl}/users`, userRouter);
app.use(`${serverConfig.apiUrl}/recipes`, recipeRouter);

const server = app.listen(serverConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[API] Server is running at https://localhost:${serverConfig.port}`);
});

const cleanup = () => {
  db.disconnectDb();
  server.close();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
