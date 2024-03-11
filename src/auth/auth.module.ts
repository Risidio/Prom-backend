import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy } from 'src/strategies';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports:[JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService,AtStrategy,MailService]
})
export class AuthModule {}

