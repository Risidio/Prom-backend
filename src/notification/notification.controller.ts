import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@ApiBearerAuth()

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
    return this.notificationService.addNotification(userId, request);
  }

  // set notification status to accept or deny
  @Put("state/:notificationId")
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @Param() params: any,
    @Body() request: {state: string},
  ): Promise<ApiResponse<any>> {
    return this.notificationService.updateNotificationState(params.notificationId, request.state);
  }
}
