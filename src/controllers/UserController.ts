import { Context } from 'koa';
import { UserService } from '../services/UserService';
import * as Debug from 'debug';
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
    const { email, password } = ctx.request.body;
    const loginRes = await UserService.login(email, password);
    ctx.body = {
      success: loginRes === true,
      msg: loginRes === true ? '登录成功' : loginRes
    };
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
