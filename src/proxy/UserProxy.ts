import { IUserDocument } from "../schemas/IUserDocument";
import { UserModel } from "../models/UserModel";

/**
 * User方法代理
 */
export class UserProxy {

  /**
   * 新建用户
   *
   * @param email 邮箱
   * @param password 密码
   */
  public static async createUser(email: string, password: string): Promise<IUserDocument> {
    return await UserModel.create({ email: email, password: password });
  }

  /**
   * 通过邮箱和密码查找用户
   *
   * @param email 邮箱
   * @param password 密码
   */
  public static async findByEmailAndPassword(email: string, password: string): Promise<IUserDocument> {
    return await UserModel.findOne({ email: email, password: password });
  }

  /**
   * 通过邮箱查询用户
   *
   * @param email 邮箱
   */
  public static async findByEmail(email: string): Promise<IUserDocument> {
    return await UserModel.findOne({ email: email });
  }
}
