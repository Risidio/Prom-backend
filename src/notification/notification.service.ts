import {
  HttpCode,
  HttpStatus,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ApiResponse,
  PaginatedResults,
  CollaboratorDto,
  NotificationsDto,
} from 'src/types';
import * as _ from 'lodash';
import { AddNotificationDto } from 'src/dto/requests/addNotificationDto';
import { v4 as uuidV4 } from 'uuid';


@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(
    id: string,
  ): Promise<ApiResponse<PaginatedResults<NotificationsDto>>> {
    try {
      const userNotifications = await this.prisma.notifications.findMany({
        where: {
          userId: id,
        },
      });

      if (!userNotifications || userNotifications.length < 1) {
        return {
          code: HttpStatus.OK,
          message: 'Successful',
          data: {
            pageNumber: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
          },
        };
      }

      return {
        code: HttpStatus.CREATED,
        message: 'Successful',
        data: {
          pageNumber: 1,
          pageSize: 10,
          totalCount: userNotifications.length,
          items: userNotifications,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occured while getting notifications.',
        data: null,
      };
    }
  }

  async addNotification(
    id: string,
    addNotificationRequest: AddNotificationDto,
  ): Promise<ApiResponse<NotificationsDto>> {
    try {
    
      var notification = await this.prisma.notifications.create({
        data: {
          userId:id,
          id :uuidV4(),
          message:addNotificationRequest.message,
          read:addNotificationRequest.read,
          state:addNotificationRequest.state,
          createdAt:addNotificationRequest.createdAt,
          updatedAt: addNotificationRequest.createdAt,
          type:addNotificationRequest.type    
                
        },
      });

      return {
        code: HttpStatus.CREATED,
        message: 'Successful',
        data: notification,
      };


    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "An error occured while adding a notification",
        data: null,
      };
    }
  }
}
