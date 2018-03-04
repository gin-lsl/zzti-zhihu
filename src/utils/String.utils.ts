/**
 * 判断字符串是否是空字符串
 *
 * @param str str
 */
const isEmpty = (str: string): boolean => str == null || str === '';

/**
 * 判断字符串数组中的每个数组是否有空
 *
 * @param array 字符串数组
 * @param len 字符串数组应该有的长度
 */
const hasEmpty = (array: Array<string>, len: number): boolean => {
  if (!array || array.length < len) {
    return true;
  }
  for (let i = 0; i < len; i++) {
    if (isEmpty(array[i])) {
      return true;
    }
  }
  return false;
};

/**
 * 字符串工具
 */
export const StringUtils = {
  isEmpty,
  hasEmpty,
};
