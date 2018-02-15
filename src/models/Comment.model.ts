import { Schema, Model, model } from "mongoose";
import { ICommentDocument } from "../schemas/index";
import { Comment } from "../entities/index";

/**
 * Comment模式
 *
 * @author lsl
 */
const CommentSchema = new Schema(Comment.createSchemaDefinition());

/**
 * Comment模型
 */
export const CommentModel: Model<ICommentDocument> = model<ICommentDocument>('Comment', CommentSchema);
