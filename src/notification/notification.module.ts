import { Module } from '@nestjs/common';
import { AtStrategy } from 'src/strategies';
import { JwtModule } from '@nestjs/jwt';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [NotificationController],
  providers: [NotificationService, AtStrategy],
})
export class NotificationModule {}
