import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import {
  ApiResponse,
  CollaboratorDto,
  NotificationsDto,
  PaginatedResults,
  TokenResponse,
} from 'src/types';
import { GetDecodedJwtPayload, PublicDecorator } from 'src/common/decorators';
import { AddCollaboratorDto } from 'src/dto/requests/addCollaboratorDto';
import { NotificationService } from './notification.service';
import { AddNotificationDto } from 'src/dto/requests/addNotificationDto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // get all notifications
  @Get()
  @HttpCode(HttpStatus.OK)
  getNotifications(
    @GetDecodedJwtPayload('access') userId: string,
  ): Promise<ApiResponse<PaginatedResults<NotificationsDto>>> {
    return this.notificationService.getNotifications(userId);
  }

  // add a notification
  @Post()
  @HttpCode(HttpStatus.OK)
  addNotification(
    @GetDecodedJwtPayload('access') userId: string,
    @Body() request: AddNotificationDto,  
  ): Promise<ApiResponse<NotificationsDto>> {
    return this.notificationService.addNotification(userId,request);
  }
}
