import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import {
  ApiResponse,
  CollaboratorDto,
  PaginatedResults,
  TokenResponse,
} from 'src/types';
import { GetDecodedJwtPayload, PublicDecorator } from 'src/common/decorators';
import { CollaboratorService } from './collaborator.service';
import { AddCollaboratorDto } from 'src/dto/requests/addCollaboratorDto';

@Controller('collaborators')
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  // get all collaborators
  @Get()
  @HttpCode(HttpStatus.OK)
  getCollaborators(
    @GetDecodedJwtPayload('access') userId: string,
  ): Promise<ApiResponse<PaginatedResults<CollaboratorDto>>> {
    return this.collaboratorService.getCollaborators(userId);
  }

  // get all collaborators
  @Put()
  @HttpCode(HttpStatus.OK)
  addCollaborators(
    @GetDecodedJwtPayload('access') userId: string,
    @Body() request: AddCollaboratorDto,  
  ): Promise<ApiResponse<CollaboratorDto>> {
    return this.collaboratorService.addCollaborator(userId,request);
  }
}
