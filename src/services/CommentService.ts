import { Context } from "koa";
import { NextCallback } from "../types/index";


/**
 * CommentService
 *
 * @author lsl
 */
export class CommentService {

  /**
   * 发表评论
   *
   * @param ctx ctx
   * @param next next
   */
  public static postComment(ctx: Context, next: NextCallback): Promise<any> {
    return;
  }

}
