import { Context } from "koa";
import { QuestionService } from "../services/QuestionService";
import * as Debug from 'debug';
import { IQuestion } from "../entities/index";
import { RequestResultUtil } from "../apiStatus/index";

const debug = Debug('zzti-zhihu:controller:question');

/**
 * QuestionController
 *
 * @author lsl
 */
export class QuestionController {

  /**
   * 发布问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async postTopic(ctx: Context, next: () => Promise<any>): Promise<any> {
    debug('问题内容: ', ctx.request.body);
    const { title, description } = ctx.request.body as IQuestion;
    const postRes = await QuestionService.postQuestion(title, description);
    ctx.body = RequestResultUtil.createSuccess<IQuestion>(postRes);
  }
}
