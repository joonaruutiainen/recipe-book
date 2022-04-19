import dotenv from 'dotenv';
import { Config } from './types';

dotenv.config();

const defaultConfig: Config = {
  server: {
    port: process.env.PORT || '9000',
    apiUrl: '/api/v1',
  },
  mongoDb: {
    user: process.env.MONGO_ATLAS_USER,
    password: process.env.MONGO_ATLAS_PW,
  },
};

export default defaultConfig;
