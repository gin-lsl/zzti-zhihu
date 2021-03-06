import * as path from 'path';
import * as Debug from 'debug';
import * as KoaSend from 'koa-send';
import { rename } from 'fs';
import { Context } from 'koa';
import { UserService } from '../services/UserService';
import { RequestResultUtil, ErrorCodeEnum } from '../apiStatus/index';
import { UserDTO, JWTDTO } from '../dto/index';
import { RegexToolsUtil, StringUtils, createJWT, verifyJWT, sendActiveMail } from '../utils/index';
import { NextCallback } from '../types/index';
import { UserProxy } from '../proxy/index';
import { AppConfig } from '../config/index';
import { QuestionService, ReplyService } from '../services/index';
import { AdminModel } from '../models';

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
  public static async get(ctx: Context, next: NextCallback): Promise<any> {

    debug('进入UserController:get');

    // 获取Authorizaion头信息, 以便确认是否传回隐私性的信息
    const authorization = ctx.get('Authorization');

    let hasAuth = false;
    try {
      const user = await verifyJWT(authorization);
      hasAuth = true;
    } catch (error) {
      hasAuth = false;
    }

    const { id } = ctx.state.params;
    if (!id || id.length !== 24) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNKNOWN_USER);
    }
    const base = await UserService.getUserInfoById(id, hasAuth);
    const postedQuestions = await QuestionService.getUserPosted(id, hasAuth);
    const savedQuestions = await QuestionService.getUserSaved(id);
    const postedReplies = await ReplyService.getRepliesByUserId(id);

    if (!base.success) {
      return ctx.body = base;
    }
    ctx.body = RequestResultUtil.createSuccess({
      base: base.successResult,
      postedQuestions: postedQuestions.success ? postedQuestions.successResult : [],
      postedReplies: postedReplies ? postedReplies.successResult : [],
      savedQuestions: savedQuestions,
    });
  }

  /**
   * 用户登录
   *
   * @param ctx ctx
   * @param next next
   */
  public static async signIn(ctx: Context, next: NextCallback): Promise<any> {

    debug('signIn');
    const { email, password, isAdmin } = ctx.request.body as {
      email: string;
      password: string;
      isAdmin: boolean;
    };
    let _body;
    if ((email == null || email === '') || (password == null || password === '')) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGIN_ERROR__EMAIL_OR_PASSWORD_ERROR, '邮箱或密码不能为空');
    }

    try {
      const loginRes = await UserService.signIn(email, password, isAdmin);
      if (loginRes.success) {
        const _result = loginRes.successResult;
        const access_token = await createJWT(JWTDTO.createJWTDTO(_result.id, _result.email, _result.username));
        _body = RequestResultUtil.createSuccess<any>({ ...loginRes.successResult, access_token });
        debug('管理员登录结果: ', _body);
      } else {
        _body = loginRes;
      }
    } catch (error) {
      debug('登录失败, 未知错误: ', error);
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
  public static async signOn(ctx: Context, next: NextCallback): Promise<any> {

    const email = ctx.request.body.email;
    debug('注册请求: email: %s', email);
    // 参数为空
    if (StringUtils.isEmpty(email)) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__NO_EMAIL, '邮箱或密码不能为空');
    }
    // 邮箱不合法
    if (!RegexToolsUtil.validEmail(email)) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__EMAIL_ILLEGAL, '邮箱格式不正确');
    }
    // 邮箱已存在
    const emailExist = await UserService.checkEmailExist(email);
    if (emailExist) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__EMAIL_EXIST, '邮箱已存在');
    }
    const access_token = await createJWT({ eml: email, tmp: Date.now() }, AppConfig.JWT_SECRET__ACTIVE, AppConfig.EXPIRES_IN__ACTIVE);
    // 如果发送邮件,则直接提示点击邮箱中的链接激活,否则直接在页面上提示激活
    // sendActiveMail(email, access_token, email);
    // #___ZZTI___
    ctx.body = RequestResultUtil.createSuccess(access_token);
  }

  /**
   * 激活账户
   *
   * @param ctx ctx
   * @param next next
   */
  public static async activeAccount(ctx: Context, next: NextCallback): Promise<any> {

    debug('激活账户');
    const { key } = ctx.query;
    debug('query: ', ctx.query);
    const verifyResult = await verifyJWT(key, AppConfig.JWT_SECRET__ACTIVE);
    if (verifyResult !== null) {
      // await UserService.activeAccount(verifyResult.uid);
      // ctx.body = UserService.getUserInfoById(verifyResult.uid);
      ctx.body = RequestResultUtil.createSuccess({ ...verifyResult, access_token: key });
    } else {
      ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 创建账户并初始化用户信息
   *
   * @param ctx ctx
   * @param next next
   */
  public static async initUser(ctx: Context, next: NextCallback): Promise<any> {

    const userInfo = ctx.request.body;
    const verifyResult = await verifyJWT<{ eml: string }>(userInfo.access_token, AppConfig.JWT_SECRET__ACTIVE);
    if (!verifyResult) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION, '邮箱验证失效, 请重新前往注册页面注册邮箱');
    }
    if (StringUtils.isEmpty(userInfo.username)
      || StringUtils.isEmpty(userInfo.password)
      || StringUtils.isEmpty(userInfo.passwordRepeat)) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.MISSING__PARAMETERS, '缺少参数');
    }
    // 密码太短
    if (userInfo.password.length < 6) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGIN_ERROR__PASSWORD_ERROR, '密码长短不能小于6位');
    }
    // 密码太简单
    if (RegexToolsUtil.pureNumber(userInfo.password)) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__PASSWORD_ERROR, '密码不能为纯数字');
    }
    // 两次输入的密码不一致
    if (userInfo.password !== userInfo.passwordRepeat) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__PASSWORD_ERROR, '两次输入的密码不一致');
    }
    // 添加用户逻辑
    let logonRes: UserDTO;
    try {
      logonRes = await UserProxy.createAndReturnProfile({
        email: verifyResult.eml, username: userInfo.username, password: userInfo.password
      });
      const access_token = await createJWT(JWTDTO.createJWTDTO(logonRes.id, logonRes.email, logonRes.username));
      return ctx.body = RequestResultUtil.createSuccess({ access_token, ...logonRes });
    } catch (error) {
      debug('添加用户失败: %O', error);
      if (logonRes) {
        await UserService.remove(logonRes.id);
      }
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 检查邮箱是否已存在
   *
   * @deprecated 暂时无用
   * @param ctx ctx
   * @param next next
   */
  public static async checkEmailCanUse(ctx: Context, next: NextCallback): Promise<any> {

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
   * 校验JWT, 是Header的 Authorization 字段的值
   *
   * @param ctx ctx
   * @param next next
   */
  public static async verifyJwt(ctx: Context, next: NextCallback): Promise<any> {

    const authorization = ctx.get('Authorization');
    debug('authorization: ', authorization);
    if (!authorization) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
    }
    const can = await verifyJWT(authorization);
    debug('can: ', can);
    if (can === null) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
    }
    ctx.state.currentUser = can;
    await next();
  }

  /**
   * 关注用户
   *
   * @param ctx ctx
   * @param next next
   */
  public static async follow(ctx: Context, next: NextCallback): Promise<any> {

    debug('关注用户');
    const { id } = ctx.state.params;
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
  public static async cancelFollow(ctx: Context, next: NextCallback): Promise<any> {

    debug('取消关注');
    const { id } = ctx.state.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    try {
      const result = await UserService.cancelFollow(uid, id);
      return ctx.body = RequestResultUtil.createSuccess(result);
    } catch (error) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 修改用户信息
   *
   * @param ctx ctx
   * @param next next
   */
  public static async modifyUser(ctx: Context, next: NextCallback): Promise<any> {

    debug('修改用户信息');

    const newInfo = ctx.request.body;

    if (StringUtils.hasEmpty([newInfo.username, newInfo.password, newInfo.passwordRepeat], 3)) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.MISSING__PARAMETERS, '缺少参数');
    }
    // 密码太短
    if (newInfo.password.length < 6) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGIN_ERROR__PASSWORD_ERROR, '密码长短不能小于6位');
    }
    // 密码太简单
    if (RegexToolsUtil.pureNumber(newInfo.password)) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__PASSWORD_ERROR, '密码不能为纯数字');
    }
    // 两次输入的密码不一致
    if (newInfo.password !== newInfo.passwordRepeat) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.LOGON_ERROR__PASSWORD_ERROR, '两次输入的密码不一致');
    }

    const userId = ctx.state.currentUser.uid;
    return ctx.body = await UserService.modifyUser(userId, newInfo);
  }

  /**
   * 修改用户头像
   *
   * @param ctx ctx
   * @param next next
   */
  public static async modifyAvatar(ctx: Context, next: NextCallback): Promise<any> {
    debug('修改用户头像');
    const uid = ctx.state.currentUser.uid;

    return new Promise((resolve, reject) => {
      try {
        const filename: string = ctx.req['file'].filename;
        debug('文件名: ', filename);
        const splited = filename.split('.');
        const suffix = splited[splited.length - 1];
        if (!/^jpg|jpeg|png$/i.test(suffix)) {
          reject('不支持的文件格式');
        }
        const newFile = uid + '.' + suffix;
        rename(path.join(AppConfig.USER_AVATAR_PATH, filename),
          path.join(AppConfig.USER_AVATAR_PATH, newFile), async (error) => {
            if (error) {
              reject(error);
            } else {
              await UserService.modifyUserAvatar(uid, newFile);
              ctx.body = RequestResultUtil.createSuccess({
                avatar: newFile,
              });
              resolve();
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 处理用户头像路径
   *
   * @param ctx ctx
   * @param next next
   */
  public static async getAvatar(ctx: Context, next: NextCallback): Promise<any> {
    const _path = ctx.path;
    await KoaSend(ctx, _path.replace('/users', ''), {
      root: AppConfig.STATIC_PATH,
    });
  }
}
