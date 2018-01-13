/**
 * JSONWebToken 的DTO
 *
 * @author lsl
 */
export class JWTDTO {

  /**
   * userId
   */
  public uid: string;

  /**
   * email
   */
  public eml: string;

  /**
   * username
   */
  public unm: string;

  /**
   * 构造器不可用, 使用 `JWTDTO.createJWTDTO` 方法
   *
   * JWTDTO对象供 `jsonwebtoken` 的 `sign` 方法使用, 该方法的参数必须为一个字面量对象
   *
   * 使用静态方法返回一个对象字面量
   *
   * @deprecated 不可用
   * @throws 强制抛出错误
   */
  private constructor() {

    throw new Error(`Don't use this constructor, use JWTDTO.createJWTDTO function instead.`);
  }

  /**
   * 构造一个 JWTDTO 对象
   * @param uid userId
   * @param eml email
   * @param unm username
   */
  public static createJWTDTO(uid: string, eml: string, unm: string): JWTDTO {

    return { uid, eml, unm };
  }

}
