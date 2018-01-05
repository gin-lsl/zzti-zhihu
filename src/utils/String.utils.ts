/**
 * 判断字符串是否是空字符串
 *
 * @param str str
 */
const isEmpty = (str: string): boolean => str == null || str === '';

/**
 * 字符串工具
 */
export const StringUtils = {
  isEmpty,
};
