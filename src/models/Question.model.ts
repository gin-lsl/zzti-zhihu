import { Schema, Model, model } from "mongoose";
import { IQuestionDocument } from "../schemas/index";
import { Question } from "../entities/index";

/**
 * Question模式
 *
 * @author lsl
 */
const QuestionSchema = new Schema(Question.createSchemaDefinition());

/**
 * Question模型
 */
export const QuestionModel: Model<IQuestionDocument> = model<IQuestionDocument>('Question', QuestionSchema);
