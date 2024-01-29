import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { ConfigModule } from '@nestjs/config';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { CollaboratorController } from './collaborator/collaborator.controller';
import { CollaboratorService } from './collaborator/collaborator.service';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    ProfileModule,
    CollaboratorModule,
    NotificationModule
  ],
  controllers: [AppController, ProfileController, CollaboratorController,NotificationController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    ProfileService,
    CollaboratorService,
    NotificationService
  ],
})
export class AppModule {}
