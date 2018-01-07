import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import * as Debug from 'debug';
import { format } from 'util';
import { MailConfig, SiteConfig } from '../config/index';

const debug = Debug('zzti-zhihu:middleware:SendEmail');

/**
 * 用来发送邮件
 */
const mailTransport = nodemailer.createTransport(MailConfig);

/**
 * 发送邮件
 *
 * @param data 发送邮件相关配置
 */
export function sendMail(data: Options): void {
  mailTransport.sendMail(data, (error: Error) => {
    debug('发送邮件');
    if (error) {
      debug('send email error: %O', error);
    }
  });
}

/**
 * 发送激活邮件
 *
 * @param who 对方邮箱
 * @param accessToken 激活的token
 * @param name 用户的称呼, 用户名\邮箱之类
 */
export function sendActiveMail(who: string, accessToken: string, name: string): void {
  const from = format('%s <%s>', SiteConfig.siteName, MailConfig.auth.user);
  const to = who;
  const cc = MailConfig.auth.user;
  const subject = SiteConfig.siteName + ' - 账户激活';
  // const subject = '星期一的作业';
  const html = `<p>您好，${name}，</p>
                <p>我们收到您在 ${SiteConfig.siteName} 的注册请求。请点击下面的链接来激活账号：</p>
                <a href="${SiteConfig.siteUrl}/active-account?key=${accessToken}&name=${name}>激活链接</a>
                <p>若您没有在 ${SiteConfig.siteName} 填写过注册信息，可能是他人滥用或者错误使用了您的电子邮箱，请忽略或直接删除此邮件即可，我们对您造成的打扰深感抱歉。</p>
                <p>${SiteConfig.siteName} 谨上。</p>`;
  // const html = `<p>您好：${name}</p>
  // <p>我们收到您在${SiteConfig.siteName}社区的注册请求。请点击下面的链接来激活账号：</p>
  // <a href="${SiteConfig.siteUrl}/active_account?key=${accessToken}&name=${name}">激活链接</a>
  // <p>若您没有在${SiteConfig.siteName}社区填写过注册信息，可能是他人滥用或者错误使用了您的电子邮箱，请忽略或者直接删除此邮箱即可，我们对给您造成的打扰深感抱歉</p>
  // <p>${SiteConfig.siteName}社区 谨上。</p>`;
  debug('from: %s', from);
  debug('to: %s', to);
  debug('subject: %s', subject);
  debug('html: %s', html);
  sendMail({ from, to, subject, html, cc });
}
