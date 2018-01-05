import { model, Schema, Document, Model } from 'mongoose';
import { ObjectId } from 'bson';
import { IUserDocument } from '../schemas/IUserDocument';
import { User } from '../entities/index';

/**
 * User模式
 */
const UserSchema = new Schema(User.createSchemaDefinition());

/**
 * User模型
 */
export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);
