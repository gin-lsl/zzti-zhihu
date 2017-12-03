import * as Debug from 'debug';
import { UserModel } from '../models/User';
import { UserProxy } from '../proxy/UserProxy';
import { IUserDocument } from '../schemas/IUser';
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
    const newUser = UserProxy.createUser(email, password);
    debug('newUser: ', newUser);
    if (!(email && password)) {
      return '请输入用户名和密码';
    }
    const findOneUser = await UserModel.findOne({
      email: email,
      password: password
    });
    debug('findOneUser: ', findOneUser);
    if (email === password) {
      return true;
    }
    return '用户名或密码不正确';
  }

  /**
   * 用户注册
   *
   * @param email 邮箱
   * @param password 密码
   */
  public static async logon(email: string, password: string): Promise<boolean | IUserDocument> {
    try {
      const user = await UserProxy.createUser(email, password);
      return user;
    } catch (e) {
      debug('新增用户失败, %O', e);
      return false;
    }
  }

  /**
   * 检查邮箱是否已被注册
   *
   * @param email 邮箱
   */
  public static async checkEmailExist(email: string): Promise<boolean> {
    debug('UserService#checkEmailExist: ', email);
    return await UserModel.findOne({ email: email }) === null;
  }

  /**
   * 检查用户名是否已存在
   *
   * @param username 用户名
   */
  public static async checkUsernameExist(username: string): Promise<boolean> {
    return await UserModel.findOne({ username: username }) === null;
  }
}
