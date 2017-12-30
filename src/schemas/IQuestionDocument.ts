import { Document } from "mongoose";
import { IQuestion } from "../entities/index";

/**
 * IQuestionDocument 接口
 *
 * @author lsl
 */
export interface IQuestionDocument extends Document, IQuestion {

}
