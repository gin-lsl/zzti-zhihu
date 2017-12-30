import { Document } from "mongoose";

/**
 * IQuestionDocument 接口
 *
 * @author lsl
 */
export interface IQuestionDocument extends Document {

  /**
   * 标题
   */
  title: string;

  /**
   * 描述
   */
  description: string;
}
