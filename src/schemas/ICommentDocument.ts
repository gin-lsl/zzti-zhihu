import { Document } from "mongoose";
import { IComment } from "../entities/index";

/**
 * ICommentDocument 接口
 *
 * @author lsl
 */
export interface ICommentDocument extends Document, IComment {
}
