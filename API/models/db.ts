/* eslint-disable no-console */
import { connect, disconnect } from 'mongoose';
import { MongoDBConfig } from '../config/types';

const connectDb = (dbConfig: MongoDBConfig) => {
  connect(dbConfig.uri, {
    autoIndex: false,
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 10000,
  })
    .then(
      () => {
        console.log('[MongoDB] Connected to Mongo Atlas database');
      },
      err => {
        console.log('[MongoDB] Error when connecting to Mongo Atlas database');
        throw err;
      }
    )
    .catch(err => {
      console.log(`[MongoDB] ${err}`);
      throw err;
    });
};

const disconnectDb = () => {
  disconnect();
  console.log('[MongoDB] Disconnected from Mongo Atlas database');
};

const db = {
  connectDb,
  disconnectDb,
};

export default db;
