import { Context } from "koa";
import * as Debug from 'debug';
import { IReply } from "../entities/index";
import { NextCallback } from "../types/index";
import { ReplyService } from "../services/index";

const debug = Debug('zzti-zhihu:controller:reply');

/**
 * ReplyController
 *
 * @author lsl
 */
export class ReplyController {

  /**
   * 发布回复
   *
   * @param ctx ctx
   * @param next next
   */
  public static async postReply(ctx: Context, next: NextCallback): Promise<any> {
    const reply = ctx.request.body as IReply;
    reply.userId = ctx.state.currentUser.uid;
    debug('发布回复 -- reply: %O', reply);
    ctx.body = await ReplyService.postReply(ctx.request.body, ctx.state.currentUser.uid, ctx.state.params.id);
  }

  /**
   * 获取某个问题的所有回复信息
   *
   * @param ctx ctx
   * @param next next
   */
  public static async getByQuestionId(ctx: Context, next: NextCallback): Promise<any> {
    ctx.body = await ReplyService.getRepliesByQuestionId(ctx.state.params.id);
  }

}
