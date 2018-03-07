/**
 * 消息类型枚举
 * @author lsl
 */
export enum MessageTypeEnum {

  /**
   * 关注的用户发布了新的问题
   */
  FOLLOWED_USER_CREATE_QUESTION = 'FOLLOWED_USER_CREATE_QUESTION',

  /**
   * 关注的用户发布了新的回答
   */
  FOLLOWED_USER_CREATE_REPLY = 'FOLLOWED_USER_CREATE_REPLY',

  /**
   * 有用户关注自己
   */
  USER_FOLLOW_ME = 'USER_FOLLOW_ME',

  /**
   * 用户给自己的问题点赞
   */
  USER_UP_MY_QUESTION = 'USER_UP_MY_QUESTION',

  /**
   * 用户给自己的回答点赞
   */
  USER_UP_MY_REPLY = 'USER_UP_MY_REPLY',

  /**
   * 用户收藏了自己的问题
   */
  USER_LIKE_MY_QUESTION = 'USER_LIKE_MY_QUESTION',

  /**
   * 用户回复了自己的问题
   */
  USER_REPLY_MY_QUESTION = 'USER_REPLY_MY_QUESTION',

  /**
   * 用户评论了自己的回复
   */
  USER_COMMENT_MY_REPLY = 'USER_COMMENT_MY_REPLY',

}
