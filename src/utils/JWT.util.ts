import { sign, verify } from 'jsonwebtoken';
import { AppConfig } from '../config/index';
import { JWTDTO } from '../dto/index';
import * as Debug from 'debug';

const debug = Debug('zzti-zhihu:util:jwt');

// 用Promise封装jsonwebtoken等方法

/**
 * 生成JWT
 *
 * 正常执行返回JSONWebToken; 发生错误返回`null`
 *
 * @param payload 负载
 * @param secretKey 密钥, 有登录用的默认值; 如果是其他用途, 请传入其他的密钥
 * @param expiresIn 过期时间, 有登录用的默认值; 如果是其他用途, 可以传入其他的参数
 */
export const createJWT = (
  payload: string | object | Buffer,
  secretKey: string = AppConfig.JWT_SECRET__SIGN,
  expiresIn: string | number = AppConfig.EXPIRES_IN__SIGN
): Promise<string | null> => {

  debug('payload: ', payload);
  return new Promise((resolve, reject) => {
    sign(payload, secretKey, { expiresIn: AppConfig.EXPIRES_IN__SIGN }, (error, jwt) => {
      debug('error: ', error);
      error ? resolve(null) : resolve(jwt);
    });
  });
};

/**
 * 校验JWT
 *
 * 正常执行返回解析后的对象; 发生错误返回`null`
 *
 * @param jwt jwt文本
 * @param secretKey 密钥, 有登录用的默认值; 如果是其他用途, 请传入其他的密钥
 */
export const verifyJWT = <T = any>(jwt: string, secretKey: string = AppConfig.JWT_SECRET__SIGN): Promise<T | null> => {

  return new Promise((resolve, reject) => {
    verify(jwt, secretKey, (error, result) => {
      debug('error: ', error);
      error ? resolve(null) : resolve(result as (T));
    });
  });
};
