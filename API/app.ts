import express, { Express, Request, Response } from 'express';
import session, { SessionOptions } from 'express-session';
import MongoStore from 'connect-mongo';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import config from 'config';

import { MongoDBConfig, ServerConfig } from './config/types';
import db from './models/db';
import csrfProtection from './middleware/csrfProtection';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import recipeRouter from './routes/recipes';

const dbConfig: MongoDBConfig = config.get('mongoDb');
const serverConfig: ServerConfig = config.get('server');
const sessionConfig: SessionOptions = config.get('session');
const corsConfig: CorsOptions = config.get('cors');

db.connectDb(dbConfig);

const app: Express = express();

// express middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(
  session({
    ...sessionConfig,
    store: MongoStore.create({
      dbName: 'RecipeBook',
      mongoUrl: dbConfig.uri,
    }),
  })
);
app.use(express.json());

// router middleware
app.get('/', csrfProtection, (req: Request, res: Response) => {
  res.cookie('XSRF_TOKEN', req.csrfToken());
  res.send(200);
});
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
