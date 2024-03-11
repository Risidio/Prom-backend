import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule.forRoot({
    transport:{
        host:process.env.SMTP_HOST,
        secure:true,
        auth:{
            user:process.env.DEFAULT_EMAIL,
            pass:process.env.EMAIL_PASSWORD
        }
    }    
  })],
  providers: [MailService],
  exports:[MailService]

})

export class MailModule {}

