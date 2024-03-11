import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';

type ForgotPasswordInfo = {
  email: string;
  token: string;
};

@Injectable()
export class MailService {
  /**
   *
   */
  constructor(private readonly mailServiceProvider: MailerService) {}

  async SendMail(request: ForgotPasswordInfo): Promise<SentMessageInfo> {
    var respone = await this.mailServiceProvider.sendMail({
      from: process.env.DEFAULT_EMAIL,
      to: request.email,
      subject: 'Reset your Prom MVP Password',
      html:`<div><b>Click on this link to reset your password.</b><br/><button><a href='test.html?resetToken=${request.token}'>Click here</a></button></div>`,
    });
  }
}

