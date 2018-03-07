import { Document } from "mongoose";
import { IMessage } from "../entities/index";

/**
 * IMessageDocument 接口
 *
 * @author lsl
 */
export interface IMessageDocument extends Document, IMessage {
}
