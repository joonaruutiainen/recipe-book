import { SessionOptions } from 'express-session';
import { CorsOptions } from 'cors';

export interface ServerConfig {
  port: string;
  apiUrl: string;
}

export interface MongoDBConfig {
  user?: string;
  password?: string;
  uri: string;
}

export interface Config {
  server: ServerConfig;
  mongoDb: MongoDBConfig;
  session: SessionOptions;
  cors: CorsOptions;
}
