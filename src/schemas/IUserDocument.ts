import * as mongoose from 'mongoose';
import { IUser } from '../entities/User';

/**
 * IUserDocument 接口
 *
 * @author lsl
 */
export interface IUserDocument extends mongoose.Document, IUser {
}
