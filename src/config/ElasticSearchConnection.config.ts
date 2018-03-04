import * as elasticsearch from 'elasticsearch';
import { ES } from './App.config';

const env: string = process.env.env;

const config = ES[env];

if (!config) {
  throw new Error('未知的环境变量: `env` ');
}

export const esClient = new elasticsearch.Client(config);
