import { sign, verify } from 'jsonwebtoken';
import { AppConfig } from '../config/index';

// 用Promise封装jsonwebtoken等方法

/**
 * 生成JWT
 *
 * @param payload 负载
 * @param secret 密钥
 */
export const createJWT = (payload: string | object | Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign(payload, AppConfig.JWT_Secret, { expiresIn: 30 }, (error, jwt) => {
      error ? reject(error) : resolve(jwt);
    });
  });
};

/**
 * 校验JWT
 *
 * @param jwt jwt文本
 * @param secret 密钥
 */
export const verifyJWT = (jwt: string): Promise<string | object> => {
  return new Promise((resolve, reject) => {
    verify(jwt, AppConfig.JWT_Secret, (error, result) => {
      error ? reject(error) : resolve(result);
    });
  });
};
