import * as Debug from 'debug';
import { UserModel } from '../models/User';
const debug = Debug('zzti-zhihu:service:user');
/**
 * UserService
 */
export class UserService {

  /**
   * 登录
   *
   * @param email 邮箱
   * @param password 密码
   */
  public static async login(email: string, password: string): Promise<boolean | string> {
    debug('email: ', email, 'password: ', password);
    let newUser = await UserModel.create({ email: email, password: password });
    debug('newUser: ', newUser);
    if (!(email && password)) {
      return '请输入用户名和密码';
    }
    let findOneUser = await UserModel.findOne({
      email: email,
      password: password
    });
    debug('findOneUser: ', findOneUser);
    if (email === password) {
      return true;
    }
    return '用户名或密码不正确';
  }
}
