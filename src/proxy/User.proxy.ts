import { IUserDocument } from "../schemas/IUserDocument";
import { UserModel } from "../models/index";
import { User } from "../entities/index";
import { UserDTO } from "../dto/index";

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

    return await UserModel.create({ email, password, username: email });
  }

  /**
   * 添加用户信息并返回用户简介
   *
   * @param user user
   */
  public static async createAndReturnProfile(user: any): Promise<UserDTO> {

    const saved = await new UserModel(user).save();
    return {
      id: saved.id,
      email: saved.email,
      username: saved.username
    };
  }

  /**
   * 通过邮箱和密码查找用户
   *
   * @param email 邮箱
   * @param password 密码
   */
  public static async findByEmailAndPassword(email: string, password: string): Promise<IUserDocument> {

    return await UserModel.findOne({ email, password });
  }

  /**
   * 通过邮箱查询用户
   *
   * @param email 邮箱
   */
  public static async findByEmail(email: string): Promise<IUserDocument> {

    return await UserModel.findOne({ email });
  }
}
