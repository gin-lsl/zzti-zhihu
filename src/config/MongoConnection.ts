import * as mongoose from 'mongoose';
import { MongoConfig } from './MongoConfig';
import * as Debug from 'debug';

const debug = Debug('zzti-zhihu:config:MongoConnection');

export const mongo = () => {
  const opts = {
    server: {
      socketOptions: {
        keepAlice: 1
      }
    }
  };
  // 不使用Mongoose的Promise，转为`any`类型防止TypeScript报错
  (<any>mongoose).Promise = Promise;
  switch (process.env.env) {
    case 'development':
      debug('开发模式');
      mongoose.connect(MongoConfig.connStr('development'), {
        useMongoClient: true
      });
      mongoose.set('debug', true);
      break;
    case 'production':
      debug('产品模式');
      mongoose.connect(MongoConfig.connStr('production'), {
        useMongoClient: true
      });
      break;
    default:
      debug('没有环境变量');
      throw new Error('请先配置环境变量 env ');
  }
};
