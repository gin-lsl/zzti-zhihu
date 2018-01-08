import { sign, verify } from 'jsonwebtoken';
import { AppConfig } from '../config/index';
import { JWTDTO } from '../dto/index';

// 用Promise封装jsonwebtoken等方法

/**
 * 生成JWT
 *
 * 正常执行返回JSONWebToken; 发生错误返回`null`
 *
 * @param payload 负载
 */
export const createJWT = (payload: JWTDTO): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    sign(payload, AppConfig.JWT_Secret, { expiresIn: AppConfig.expiresIn }, (error, jwt) => {
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
 */
export const verifyJWT = (jwt: string): Promise<JWTDTO | null> => {
  return new Promise((resolve, reject) => {
    verify(jwt, AppConfig.JWT_Secret, (error, result) => {
      error ? resolve(null) : resolve(result as (JWTDTO | null));
    });
  });
};
