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
import { ApiResponse } from 'src/types';

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
            code:HttpStatus.OK,
            message:"Successful",
            data:true
        }
      
    } catch (error) {
        console.log(error);

        return {
            code:HttpStatus.INTERNAL_SERVER_ERROR,
            message:"An error occured while updating tour stage.",
            data:null
        }
    }
  }
}
