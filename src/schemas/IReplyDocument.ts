import { Document } from "mongoose";
import { IReply } from "../entities/index";

/**
 * IReplyDocument 接口
 *
 * @author lsl
 */
export interface IReplyDocument extends Document, IReply {
}
