import { Schema, Model, model } from "mongoose";
import { IReplyDocument } from "../schemas/index";
import { Reply } from "../entities/index";

/**
 * Reply模式
 *
 * @author lsl
 */
const ReplySchema = new Schema(Reply.createSchemaDefinition());

/**
 * Reply模型
 */
export const ReplyModel: Model<IReplyDocument> = model<IReplyDocument>('Reply', ReplySchema);
