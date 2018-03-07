import { Context } from 'koa';
import { NextCallback } from '../types/index';
import { IComment } from '../entities/index';
import { CommentService } from '../services/index';
import * as Debug from 'debug';

const debug = Debug('zzti-zhihu:controller:comment');

/**
 * CommentController
 *
 * @author lsl
 */
export class CommentController {

  /**
   * 发布评论
   *
   * @param ctx ctx
   * @param next next
   */
  public static async postComment(ctx: Context, next: NextCallback): Promise<any> {
    const comment = ctx.request.body as IComment;
    debug('发布评论 -- %O', comment);
    const state = ctx.state;
    ctx.body = await CommentService.postComment(comment, state.currentUser.uid, state.params.qid, state.params.rid);
  }

  /**
   * 获取某个问题的所有回复信息
   *
   * @param ctx ctx
   * @param next next
   */
  public static async getByQuestionId(ctx: Context, next: NextCallback): Promise<any> {
    ctx.body = await CommentService.getCommentsByQuestionId(ctx.state.params.id);
  }
}
