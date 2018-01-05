import { Context } from "koa";
import { NextCallback } from "../types/index";
import { RequestResultUtil, ErrorCodeEnum } from "../apiStatus/index";
import * as Debug from 'debug';
const debug = Debug('zzti-zhihu:middleware:verifyObjectId');

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
  if (!id || id.length !== 24) {
    debug(`id: '%s' 不符合ObjectId规则`, id);
    return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
  }
  ctx.state.params = { id };
  await next();
};
