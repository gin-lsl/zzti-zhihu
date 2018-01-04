import { Context } from 'koa';
import { UserService } from '../services/UserService';
import * as Debug from 'debug';
import { createJWT, verifyJWT } from '../middleware/index';
import { RequestResultUtil, ErrorCodeEnum } from '../apiStatus/index';
import { UserDTO } from '../dto/index';
import { RegexTools, StringUtils } from '../utils/index';

const debug = Debug('zzti-zhihu:controller:user');

/**
 * UserController
 */
export class UserController {

  /**
   * 获取用户信息
   *
   * @param ctx ctx
   * @param next next
   */
  public static async get(ctx: Context, next: () => Promise<any>): Promise<any> {
    debug('进入UserController:get');
    const { id } = ctx.params;
    if (!id || id.length !== 24) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNKNOWN_USER);
    }
    ctx.body = await UserService.getUserInfoById(id);
  }

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
    if ((email == null || email === '') || (password == null || password === '')) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGIN_ERROR__EMAIL_OR_PASSWORD_ERROR, '邮箱或密码不能为空');
    }
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
    const { email, password, passwordRepeat } = ctx.request.body;
    debug('注册请求: email: %s, password: %s, passwordRepeat: %s', email, password, passwordRepeat);
    // 参数为空
    if (StringUtils.isEmpty(email) || StringUtils.isEmpty(password)) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__NO_EMAIL_OR_PASSWORD, '邮箱或密码不能为空');
    }
    // 邮箱不合法
    if (!RegexTools.validEmail(email)) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__EMAIL_ILLEGAL);
    }
    // 密码太短
    if (password.length < 6) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGIN_ERROR__PASSWORD_ERROR, '密码长短不能小于6位');
    }
    // 密码太简单
    if (RegexTools.pureNumber(password)) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__PASSWORD_ERROR, '密码不能为纯数字');
    }
    // 两次输入的密码不一致
    if (password !== passwordRepeat) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__PASSWORD_ERROR, '两次输入的密码不一致');
    }
    // 邮箱已存在
    const emailExist = await UserService.checkEmailExist(email);
    if (emailExist) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__EMAIL_EXIST);
    }
    // 注册逻辑
    let logonRes;
    try {
      logonRes = await UserService.logon(email, password);
      const access_token = await createJWT({
        uid: logonRes.id,
        eml: logonRes.email,
        nam: logonRes.username
      });
      ctx.body = RequestResultUtil.createSuccess(access_token);
    } catch (error) {
      if (logonRes) {
        await UserService.remove(logonRes.id);
      }
    } finally {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }


  /**
   * 激活账户
   *
   * @param ctx ctx
   * @param next next
   */
  public static async activeAccount(ctx: Context, next: () => Promise<any>): Promise<any> {
    debug('激活账户');
    const { key } = ctx.query;
    const verifyResult = await verifyJWT(key);
    if (verifyResult !== null) {
      // ctx.body = UserService.getUserInfoById(verifyResult.uid);
      ctx.body = RequestResultUtil.createSuccess(verifyResult);
    } else {
      ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 检查邮箱是否已存在
   *
   * @deprecated 暂时无用
   * @param ctx ctx
   * @param next next
   */
  public static async checkEmailCanUse(ctx: Context, next: () => Promise<any>): Promise<any> {
    const { email } = ctx.request.body;
    debug('判断邮箱是否已经注册', email);
    const checkRes = await UserService.checkEmailExist(email);
    debug('是否注册: ', checkRes);
    if (checkRes) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__EMAIL_EXIST);
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
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
    }
    const can = await verifyJWT(_authorization1);
    debug('can: ', can);
    if (can === null) {
      ctx.body = RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
    } else {
      ctx.state.currentUser = can;
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
    const { id } = ctx.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNKNOWN_USER);
    }
    if (id === uid) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_DO_FOR_SELF);
    }
    const followRes = await UserService.follow(uid, id);
    debug('followRes: ', followRes);
    return ctx.body = followRes;
  }

  /**
   * 取消关注用户
   *
   * @param ctx ctx
   * @param next next
   */
  public static async cancelFollow(ctx: Context, next: () => Promise<any>): Promise<any> {
    debug('取消关注');
    const { id } = ctx.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    try {
      await UserService.cancelFollow(uid, id);
      return ctx.body = RequestResultUtil.createSuccess();
    } catch (e) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }
}
