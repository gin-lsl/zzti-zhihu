import { Context } from 'koa';
import { sign } from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import * as Debug from 'debug';
import { createJWT, verifyJWT } from '../middleware/index';
import { RequestResultUtil, ErrorCodeEnum } from '../apiStatus/index';
import { UserDTO } from '../dto/index';

const debug = Debug('zzti-zhihu:controller:user');

/**
 * UserController
 */
export class UserController {

  /**
   * 用户登录
   *
   * @param ctx ctx
   * @param next next
   */
  public static async login(ctx: Context, next: () => Promise<any>): Promise<any> {
    debug('进入UserController:login');
    const { email, password } = ctx.request.body;
    let _body;
    try {
      const loginRes = await UserService.login(email, password);
      if (loginRes.success) {
        const access_token = await createJWT({
          uid: loginRes.successResult.id,
          eml: loginRes.successResult.email,
          nam: loginRes.successResult.username
        });
        _body = RequestResultUtil.createSuccess<any>({ ...loginRes.successResult, access_token });
      } else {
        ctx.status = 401;
        _body = loginRes;
      }
    } catch (e) {
      _body = RequestResultUtil.createError(ErrorCodeEnum.LOGIN_ERROR__UNDEFINED);
    }
    ctx.body = _body;
  }

  /**
   * 注册请求
   *
   * @param ctx ctx
   * @param next next
   */
  public static async logon(ctx: Context, next: () => Promise<any>): Promise<any> {
    const { email, password } = ctx.request.body;
    debug('注册请求: email: %s, password: %s', email, password);
    const logonRes = await UserService.logon(email, password);
    ctx.body = {
      res: logonRes
    };
  }

  /**
   * 检查邮箱是否已存在
   *
   * @param ctx ctx
   * @param next next
   */
  public static async checkEmailCanUse(ctx: Context, next: () => Promise<any>): Promise<any> {
    const { email } = ctx.request.body;
    debug('判断邮箱是否已经注册', email);
    const checkRes = await UserService.checkEmailExist(email);
    debug('是否注册: ', checkRes);
    if (checkRes) {
      return ctx.body = {
        success: false,
        msg: '邮箱已注册'
      };
    }
    await next();
  }

  /**
   * 校验JWT
   *
   * @param ctx ctx
   * @param next next
   */
  public static async verifyJwt(ctx: Context, next: () => Promise<any>): Promise<any> {
    const _authorization1 = ctx.get('Authorization');
    debug('_authorization1: ', _authorization1);
    if (!_authorization1) {
      ctx.body = RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
      return;
    }
    let can;
    try {
      can = await verifyJWT(_authorization1);
      ctx.state = can;
      debug('can: ', can);
      await next();
    } catch (e) {
      debug('校验错误: ', e);
      ctx.body = RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
    }
  }

  /**
   * 关注用户
   *
   * @param ctx ctx
   * @param next next
   */
  public static async follow(ctx: Context, next: () => Promise<any>): Promise<any> {
    debug('关注用户');
    const { id } = ctx.request.body;
    const { uid } = ctx.state;
    if (!id) {
      ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNKNOWN_USER);
      return;
    }
    if (!uid) {
      ctx.body = RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
      return;
    }
    if (id === uid) {
      ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_DO_FOR_SELF);
      return;
    }
    const followRes = await UserService.follow(uid, id);
    debug('followRes: ', followRes);
    ctx.body = followRes;
  }

  public static async cancelFollow(ctx: Context, next: () => Promise<any>): Promise<any> {
    debug('取消关注');
    const { id } = ctx.request.body;
    const { uid } = ctx.state;
    try {
      await UserService.cancelFollow(uid, id);
      ctx.body = RequestResultUtil.createSuccess();
    } catch (e) {
      ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }
}
