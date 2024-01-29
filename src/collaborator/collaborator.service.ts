import {
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
var bcp = require('bcryptjs');
import { v4 as uuidV4 } from 'uuid';
import {
  ApiResponse,
  PaginatedResults,
  TokenResponse,
  CollaboratorDto,
} from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import * as _ from 'lodash';
import { UserDto } from 'src/dto/responses/UserDto';
import { AddCollaboratorDto } from 'src/dto/requests/addCollaboratorDto';

@Injectable()
export class CollaboratorService {
  constructor(private prisma: PrismaService) {}

  async getCollaborators(
    id: string,
  ): Promise<ApiResponse<PaginatedResults<CollaboratorDto>>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!existingUser) throw new NotFoundException('User not found.');

      let collaborators:Array<CollaboratorDto>;
      let deserializedData:Array<CollaboratorDto>;

      if (
        !existingUser.collaborators 
      ) {
        existingUser.collaborators = JSON.stringify([]);
      } else {
        deserializedData = JSON.parse(existingUser.collaborators);

        deserializedData.map((c) => {
          id: c.id;
          name: c.name;
          email: c.email;
          pronouns: c.pronouns;
          cinemaWorker: c.cinemaWorker;
          roles: c.roles;
          accountState: c.accountState;
        });

      }

      if (deserializedData.length < 1) {
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
          totalCount: deserializedData.length,
          items: deserializedData,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occured while getting collaborators.',
        data: null,
      };
    }
  }

  async addCollaborator(id:string,
    addCollaboratorRequest: AddCollaboratorDto,
  ): Promise<ApiResponse<CollaboratorDto>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id
        }
      });

      if (!existingUser) throw new NotFoundException('User not found.');

      let collaborators;
      let deserializedData:Array<CollaboratorDto>;

      if (
        !existingUser.collaborators ||
        existingUser.collaborators.length < 1
      ) {
        existingUser.collaborators = JSON.stringify([addCollaboratorRequest]);
      } else {
        deserializedData = JSON.parse(existingUser.collaborators);

        console.log(deserializedData);

        let existingCollaborator = deserializedData.find(c => c.id == addCollaboratorRequest.id);

        if(existingCollaborator){
         return {
          code: HttpStatus.BAD_REQUEST,
          message: 'Collaborator already added.',
          data: null,
         }
        }
      }

      // update 
      var user = await this.prisma.user.update({
        where: {
          id
        },
        data: {
          collaborators: JSON.stringify([{
            id:addCollaboratorRequest.id,
            name:addCollaboratorRequest.name,
            email:addCollaboratorRequest.email,
            roles:addCollaboratorRequest.roles,
            pronouns:addCollaboratorRequest.pronouns,
            cinemaWorker:addCollaboratorRequest.cinemaWorker
          },...deserializedData]),
          updatedAt: new Date()
        },
      });

      if (!user)
        throw new PreconditionFailedException(
          'Profile update was not successful.',
        );


      return {
        code: HttpStatus.CREATED,
        message: 'Successful',
        data: addCollaboratorRequest,
      };

    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "An error occured while adding a user's collaborator",
        data: null,
      };
    }
  }
}
