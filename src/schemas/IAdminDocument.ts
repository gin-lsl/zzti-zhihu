import * as mongoose from "mongoose";
import { IAdmin } from "../entities/Admin";

export interface IAdminDocument extends mongoose.Document, IAdmin {
}
