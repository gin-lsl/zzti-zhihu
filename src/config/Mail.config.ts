import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

/**
 * 邮件服务器配置
 */
export const MailConfig: SMTPTransport.Options = {
  host: 'smtp.163.com',
  port: 465,
  auth: {
    user: '',
    pass: ''
  }
};
