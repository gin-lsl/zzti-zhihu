import { IQuestionDocument } from "../schemas/index";
import { QuestionModel } from "../models/index";
import * as Debug from 'debug';
import { Question, IQuestion } from "../entities/index";

const debug = Debug('zzti-zhihu:service:question');

/**
 * QuestionService
 *
 * @author lsl
 */
export class QuestionService {

  /**
   * 保存问题
   *
   * @param title 标题
   * @param description 描述
   */
  public static async postQuestion(title: string, description: string): Promise<any> {
    const question = new QuestionModel({ title, description });
    return question.save();
  }

  /**
   * 收藏问题
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async collect(questionId: string, userId): Promise<any> {
    const question = await QuestionModel.findById(questionId);
    if (question) {
      const qu: IQuestion = new Question();
    }
    return question;
  }

}
