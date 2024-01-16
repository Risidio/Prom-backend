import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { ProfileUpdateDto } from 'src/dto/requests/profileUpdateDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as _ from 'lodash';
import { UserDto } from 'src/dto/responses/UserDto';
import { ApiResponse, TourStageDto } from 'src/types';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(
    userId: string,
    request: ProfileUpdateDto,
  ): Promise<ApiResponse<UserDto>> {
    try {
      var user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: request.name,
          pronouns: request.pronouns,
          cinemaWorker: request.isCinemaWorker,
          roles: request.roles,
          updatedAt: new Date(),
        },
      });

      if (!user)
        throw new PreconditionFailedException(
          'Profile update was not successful.',
        );

      const data = _.pick(user, [
        'id',
        'email',
        'name',
        'pronouns',
        'cinemaWorker',
        'roles',
        'profileCompleted',
        'isTourCompleted',
        'tourStage',
        'accountState',
        'registered',
        'updatedAt',
      ]);

      return {
        code: HttpStatus.OK,
        message: 'Successful',
        data,
      };
    } catch (error) {
      console.log(error);

      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occured while updating the user profile',
        data: null,
      };
    }
  }

  async updateTourStage(userId: string, stage: number) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser) throw new NotFoundException('User not found.');

      if (existingUser.tourStage > 5)
        throw new BadRequestException('Tour stages have been completed.');

      var user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          tourStage: stage,
          updatedAt: new Date(),
        },
      });

      if (!user)
        throw new PreconditionFailedException(
          'Tour stage update was not successful.',
        );

      return {
        code: HttpStatus.OK,
        message: 'Successful',
        data: true,
      };
    } catch (error) {
      console.log(error);

      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occured while updating tour stage.',
        data: null,
      };
    }
  }

  async checkTourStage(userId):Promise<ApiResponse<TourStageDto | null>>{
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser) throw new NotFoundException('User not found.');

      if (existingUser.tourStage > 5)
        return {
          code: HttpStatus.OK,
          message: 'Tour stages have been completed.',
          data: {
            tourStage:existingUser.tourStage
          },
        };

      return {
        code: HttpStatus.OK,
        message: 'Tour stages have not been completed.',
        data: {
          tourStage:existingUser.tourStage
        }
      };
    } catch (error) {
      console.log(error);

      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occured while checking tour stage.',
        data: null,
      };
    }
  }

  async getUser(userId: string): Promise<ApiResponse<UserDto>> {
    try {

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
      });

      if (!user) throw new NotFoundException('User not found');     

      const data = _.pick(user, [
        'id',
        'email',
        'name',
        'pronouns',
        'cinemaWorker',
        'roles',
        'profileCompleted',
        'isTourCompleted',
        'tourStage',
        'accountState',
        'registered',
        'token',
        'updatedAt',
      ]);

      return {
        code: HttpStatus.OK,
        message: 'Successful',
        data
      };
      
    } catch (error) {

      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occured while getting user profile',
        data: null,
      };
    }
  }
}
