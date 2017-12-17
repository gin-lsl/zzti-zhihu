import { sign } from 'jsonwebtoken';

// 用Promise封装jsonwebtoken等方法

/**
 * 生成JWT
 *
 * @param payload 负载
 * @param secret 密钥
 */
export const createJWT = (payload: string | object | Buffer, secret: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign(payload, secret, { expiresIn: 30 }, (error, jwt) => {
      error ? reject(error) : resolve(jwt);
    });
  });
};

