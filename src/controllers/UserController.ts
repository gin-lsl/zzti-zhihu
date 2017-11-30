import { Context } from 'koa';
import { UserService } from '../services/UserService';

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
    let { email, password } = ctx.request.body;
    let loginRes = await UserService.login(email, password);
    ctx.body = {
      success: loginRes === true,
      msg: loginRes === true ? '登录成功' : loginRes
    };
  }
}
