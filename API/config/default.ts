import dotenv from 'dotenv';
import { Config } from './types';

dotenv.config();

if (!process.env.SESSION_SECRET) throw new Error('process.env.SESSION_SECRET is undefined');

const defaultConfig: Config = {
  server: {
    port: process.env.PORT || '9000',
    apiUrl: '/api/v1',
  },
  mongoDb: {
    uri: `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@recipe-app.mjlfo.mongodb.net/RecipeBook?retryWrites=true&w=majority`,
  },
  session: {
    name: 'sessionId',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-XSRF-TOKEN',
    credentials: true,
  },
};

export default defaultConfig;
