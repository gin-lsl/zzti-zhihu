import { Context } from "koa";
import { NextCallback } from "../types/index";
import { RequestResultUtil, ErrorCodeEnum } from "../apiStatus/index";
import * as Debug from 'debug';
const debug = Debug('zzti-zhihu:middleware:verifyObjectId');

/**
 * 数据库的ObjectId长度
 */
const MONGODB_OBJECT_ID_LENGTH: number = 24;

/**
 * 验证 `params` 中的 `id` 是否符合 `Mongo ObjectId` 的要求
 *
 * 如果不符合, 则直接返回错误响应,
 *
 * 如果符合, 则把 `id` 值附加到 `ctx.state.params.id` 上面
 *
 * @param ctx ctx
 * @param next next
 */
export const verifyObjectIdMiddleware = async (ctx: Context, next: NextCallback): Promise<any> => {
  debug('校验verifyObjectId');
  const { id } = ctx.params;
  if (!id || id.length !== MONGODB_OBJECT_ID_LENGTH) {
    debug(`id: '%s' 不符合ObjectId规则.`, id);
    return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
  }
  ctx.state.params = { id };
  await next();
};

/**
 * 返回判断的函数
 *
 * @param params 需要验证的参数
 */
export const curryVerifyObjectMiddleware = (params: Array<string>) => {
  return async (ctx: Context, next: NextCallback) => {
    debug('params: ', params);
    debug('ctx.params: ', ctx.params);
    const _ps = {};
    for (let i = 0; i < params.length; i++) {
      const pv = ctx.params[params[i]];
      if (!pv || pv.length !== MONGODB_OBJECT_ID_LENGTH) {
        debug(`参数: [%s] 的值: [%s] 不符合ObjectId规则.`, params[i], pv);
        return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
      }
      _ps[params[i]] = pv;
    }
    ctx.state.params = _ps;
    await next();
  };
};
