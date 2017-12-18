import * as Debug from 'debug';
import { UserModel } from '../models/User';
import { UserProxy } from '../proxy/UserProxy';
import { IUserDocument } from '../schemas/IUser';
import { IServiceResult } from '../interfaces/index';
import { ErrorCodeEnum, RequestResultUtil } from '../apiStatus/index';
import { UserDTO } from '../dto/index';
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
  public static async login(email: string, password: string): Promise<IServiceResult<UserDTO>> {
    if (!(email && password)) {
      return RequestResultUtil.createError(ErrorCodeEnum.LOGIN_ERROR__EMAIL_OR_PASSWORD_ERROR);
    }
    const findOneUser = await UserProxy.findByEmailAndPassword(email, password);
    if (findOneUser) {
      return RequestResultUtil.createSuccess<UserDTO>({ email: email, username: findOneUser.username });
    }
    return RequestResultUtil.createError(ErrorCodeEnum.LOGIN_ERROR__EMAIL_OR_PASSWORD_ERROR);
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
   * 检查邮箱是否已被注册, 返回true表示已注册
   *
   * @param email 邮箱
   */
  public static async checkEmailExist(email: string): Promise<boolean> {
    debug('UserService#checkEmailExist: ', email);
    return await UserModel.findOne({ email: email }) !== null;
  }

  /**
   * 检查用户名是否已存在，返回true表示用户名已存在
   *
   * @param username 用户名
   */
  public static async checkUsernameExist(username: string): Promise<boolean> {
    return await UserModel.findOne({ username: username }) !== null;
  }
}
