import { Context } from 'koa';
import { sign } from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import * as Debug from 'debug';
import { createJWT } from '../middleware/index';
import { RequestResultUtil, ErrorCodeEnum } from '../apiStatus/index';
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
        const access_token = await createJWT({ uid: 'ginlsl', nam: 'ginlsl' }, 'asdfasdfasdf');
        _body = RequestResultUtil.createSuccess<any>({ ...loginRes.successResult, access_token });
      } else {
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
}
