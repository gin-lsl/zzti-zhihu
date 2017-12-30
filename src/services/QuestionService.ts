import { IQuestionDocument } from "../schemas/index";
import { QuestionModel } from "../models/index";

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
}
