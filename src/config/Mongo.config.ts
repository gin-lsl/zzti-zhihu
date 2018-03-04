import { DB } from './App.config';

const connConfig = {
  development: {
    connectionString: `mongodb://${DB.development.dbHost}/${DB.development.dbName}`
  },
  production: {
    connectionString: `mongodb://${DB.production.dbHost}/${DB.production.dbName}`
  }
};

export class MongoConfig {

  /**
   * 获取Mongo连接信息
   * @param envMode 开发环境
   */
  public static connStr(envMode: 'development' | 'production' = 'development'): string {
    if (envMode !== 'development') {
      envMode = 'development';
    }
    return connConfig[envMode].connectionString;
  }
}
