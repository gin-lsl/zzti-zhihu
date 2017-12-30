import { Schema, Model, model } from "mongoose";
import { IQuestionDocument } from "../schemas/index";

/**
 * Question模式
 *
 * @author lsl
 */
const QuestionSchema = new Schema({

  title: String,

  description: String,

});

/**
 * Question模型
 */
export const QuestionModel: Model<IQuestionDocument> = model<IQuestionDocument>('Question', QuestionSchema);
