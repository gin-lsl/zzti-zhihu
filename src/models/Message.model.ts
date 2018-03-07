import { Schema, Model, model } from "mongoose";
import { IMessageDocument } from "../schemas/index";
import { Message } from "../entities/index";

/**
 * Message模式
 *
 * @author lsl
 */
const MessageSchema = new Schema(Message.createSchemaDefinition());

/**
 * Message模型
 */
export const MessageModel: Model<IMessageDocument> = model<IMessageDocument>('Message', MessageSchema);
