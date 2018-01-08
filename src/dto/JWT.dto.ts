/**
 * JSONWebToken 的DTO
 */
export class JWTDTO {

  /**
   * userid
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
   * 构造一个JWT对象
   *
   * @param uid userId
   * @param eml email
   * @param unm username
   */
  constructor(
    uid: string,
    eml: string,
    unm: string
  ) {
    this.uid = uid;
    this.eml = eml;
    this.unm = unm;
  }
}
