export interface ServerConfig {
  port: string;
  apiUrl: string;
}

export interface MongoDBConfig {
  user?: string;
  password?: string;
}

export interface Config {
  server: ServerConfig;
  mongoDb: MongoDBConfig;
}
