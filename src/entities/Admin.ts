import { SchemaDefinition } from "mongoose";

export interface IAdmin {
  email: string;
  username: string;
  password: string;
}

export class Admin implements IAdmin {
  id: string;
  email: string;
  username: string;
  password: string;

  static createSchemaDefinition(): SchemaDefinition {
    return {
      id: String,
      email: String,
      username: String,
      password: String,
    };
  }
}
