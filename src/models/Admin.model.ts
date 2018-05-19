import { Schema, model, Model } from "mongoose";
import { Admin } from "../entities";
import { IAdminDocument } from "../schemas/IAdminDocument";

const AdminSchema = new Schema(Admin.createSchemaDefinition());

export const AdminModel: Model<IAdminDocument> = model<IAdminDocument>('Admin', AdminSchema);
