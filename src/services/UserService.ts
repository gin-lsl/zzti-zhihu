import * as Debug from 'debug';
import { UserModel } from '../models/index';
import { UserProxy } from '../proxy/index';
import { IUserDocument } from '../schemas/IUserDocument';
import { IServiceResult } from '../interfaces/index';
import { ErrorCodeEnum, RequestResultUtil } from '../apiStatus/index';
import { UserDTO } from '../dto/index';
import { IUser } from '../entities/index';
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
  public static async signIn(email: string, password: string): Promise<IServiceResult<UserDTO>> {
    debug('signIn -> email: %s, password: %s', email, password);
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
  public static async signOn(email: string, password: string): Promise<UserDTO> {
    debug('signOn -> email: %s, password: %s', email, password);
    return await UserProxy.createUser(email, password) as UserDTO;
  }

  /**
   * 删除指定id的用户
   *
   * @param id 用户id
   */
  public static async remove(id: string): Promise<any> {
    return await UserModel.findByIdAndRemove(id);
  }

  /**
   * 激活账户
   *
   * @param id 用户id
   */
  public static async activeAccount(id: string): Promise<any> {
    return await UserModel.findByIdAndUpdate(id, { $set: { actived: true } });
  }

  /**
   * 检查邮箱是否已被注册, 返回true表示已注册
   *
   * @param email 邮箱
   */
  public static async checkEmailExist(email: string): Promise<boolean> {
    debug('checkEmailExist -> email: ', email);
    return await UserModel.findOne({ email }) !== null;
  }

  /**
   * 检查用户名是否已存在，返回true表示用户名已存在
   *
   * @param username 用户名
   */
  public static async checkUsernameExist(username: string): Promise<boolean> {
    return await UserModel.findOne({ username }) !== null;
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
    debug('打印已关注用户列表: ', currUser.hesFollowIds, ', 要关注的用户: ', toUser.id);
    if (currUser.hesFollowIds.find(p => p === toUser.id)) {
      debug('判断是否已存在');
      return RequestResultUtil.createError(ErrorCodeEnum.OPERATION_DUPLICATION);
    }
    try {
      debug('更新关注用户列表');
      currUser.hesFollowIds.push(toUser.id);
      toUser.followHimIds.push(currUser.id);
      await currUser.save();
      await toUser.save();
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
  public static async cancelFollow(currUserId: string, toUserId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(currUserId, { $pull: { hesFollow: toUserId } });
    await UserModel.findByIdAndUpdate(toUserId, { $pull: { followHim: currUserId } });
  }

  /**
   * 通过id获取用户信息
   *
   * @param userId 用户id
   */
  public static async getUserInfoById(userId: string): Promise<IServiceResult<IUser>> {
    const user = await UserModel.findById(userId);
    if (user) {
      // 只返回安全信息
      const userInfo: any = {};
      userInfo.id = user.id;
      userInfo.email = user.email;
      userInfo.avatar = user.avatar;
      userInfo.gender = user.gender;
      userInfo.hesFollow = user.hesFollowIds;
      userInfo.lastLoginTime = user.lastLoginTime;
      userInfo.logonTime = user.logonTime;
      userInfo.profile = user.profile;
      userInfo.lv = user.lv;
      userInfo.username = user.username;
      return RequestResultUtil.createSuccess(userInfo);
    } else {
      return RequestResultUtil.createError(ErrorCodeEnum.UNKNOWN_USER);
    }
  }

}
