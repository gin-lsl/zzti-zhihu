/**
 * 判断字符串是否是空字符串
 *
 * @param str str
 */
const isEmpty = (str: string): boolean => str == null || str === '';

export const StringUtils = {
  isEmpty,
};
