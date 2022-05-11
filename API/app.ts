import express, { Express, Request, Response } from 'express';
import session, { SessionOptions } from 'express-session';
import MongoStore from 'connect-mongo';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from 'config';

import { MongoDBConfig, ServerConfig } from './config/types';
import db from './models/db';
import csrfProtection from './middleware/csrfProtection';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import recipeRouter from './routes/recipes';
import loadUserFromRequest from './utils/loadUser';
import makeResponse from './utils/responseHandler';
import APIError from './models/apiError';

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
app.use(morgan('dev'));

// router middleware
app.get(serverConfig.apiUrl, csrfProtection, async (req: Request, res: Response) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  const { error } = await loadUserFromRequest(req);
  if (error) return makeResponse.error(res, new APIError('User is not authenticated', 401));
  return makeResponse.success(res, 200);
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
