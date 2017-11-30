const env = process.env;
const dbName: string = 'zzti_zhihu';

const connConfig = {
  development: {
    connectionString: `mongodb://127.0.0.1:27017/${dbName}`
  },
  production: {
    connectionString: `mongodb://${env.url}`
  }
}

export class MongoConfig {

  /**
   * 数据库名
   */
  public static dbName: string = `${dbName}`;

  /**
   * 获取Mongo连接信息
   * @param env 开发环境
   */
  public static connStr(env: 'development' | 'production' = 'development'): string {
    if (env !== 'development') {
      env = 'development';
    }
    return connConfig[env].connectionString;
  }
}
