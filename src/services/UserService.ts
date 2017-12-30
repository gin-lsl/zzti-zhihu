import * as Debug from 'debug';
import { UserModel } from '../models/UserModel';
import { UserProxy } from '../proxy/UserProxy';
import { IUserDocument } from '../schemas/IUserDocument';
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
      return RequestResultUtil.createSuccess<UserDTO>({ id: findOneUser.id, email: findOneUser.email, username: findOneUser.username });
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

  /**
   * 关注用户
   *
   * @param currUserId 当前用户的id
   * @param toUserId 要关注的用户的id
   */
  public static async follow(currUserId: string, toUserId: string): Promise<any> {
    const currUser = await UserModel.findById(currUserId);
    const toUser = await UserModel.findById(toUserId);
    // 找不到用户
    if (!(currUser && toUser)) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNKNOWN_USER);
    }
    debug('打印已关注用户列表: ', currUser.hesFollow, ', 要关注的用户: ', toUser.id);
    if (currUser.hesFollow.find(p => p === toUser.id)) {
      debug('判断是否已存在');
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR, '已经关注了对方, 请勿重复关注');
    }
    try {
      debug('更新关注用户列表');
      currUser.hesFollow.push(toUser.id);
      toUser.followHim.push(currUser.id);
      currUser.save();
      toUser.save();
      return RequestResultUtil.createSuccess();
    } catch (e) {
      debug('保存出错: ', e);
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 取消关注用户
   *
   * @param currUserId 当前用户的id
   * @param toUserId 要关注的用户的id
   */
  public static async cancelFollow(currUserId: string, toUserId: string): Promise<any> {
    await UserModel.findByIdAndUpdate(currUserId, { $pull: { hesFollow: toUserId } });
    await UserModel.findByIdAndUpdate(toUserId, { $pull: { followHim: currUserId } });
  }

}
