
/**
 * 匹配邮箱
 */
// tslint:disable-next-line:max-line-length
const regexEmail = /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/;

/**
 * 匹配纯数字
 */
const regexPureNumber = /^\d+$/;

/**
 * 验证邮箱是否合法
 *
 * @param emailString 邮箱字符串
 */
const validEmail = (emailString: string): boolean => regexEmail.test(emailString);

/**
 * 检查字符串是否所有字符都是数字
 *
 * @param str 要检查的字符串
 */
const pureNumber = (str: string): boolean => regexPureNumber.test(str);

export const RegexToolsUtil = {
  regexEmail,
  regexPureNumber,
  validEmail,
  pureNumber,
};
