/**
 * IQuestion 接口
 *
 * @author lsl
 */
export interface IQuestion {

  /**
   * 标题
   */
  title: string;

  /**
   * 描述
   */
  description: string;
}

/**
 * Question 类
 *
 * @author lsl
 */
export class Question implements IQuestion {

  /**
   * 标题
   */
  title: string;

  /**
   * 描述
   */
  description: string;
}
