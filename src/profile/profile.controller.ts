import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileUpdateDto } from 'src/dto/requests/profileUpdateDto';
import { TourStageUpdateDto } from 'src/dto/requests/tourStageUpdateDto';
import { ApiResponse, TourStageDto, UserDto } from 'src/types';
import { GetDecodedJwtPayload } from 'src/common/decorators';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // update profile
  @Put()
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @GetDecodedJwtPayload('access') userId: string,
    @Body() request: ProfileUpdateDto,  
  ): Promise<ApiResponse<UserDto>> {
    return this.profileService.updateProfile(userId, request);
  }

  // update tour stage
  @Put('tour-stage')
  @HttpCode(HttpStatus.OK)
  updateTourStage(
    @GetDecodedJwtPayload('access') userId: string,
    @Body() request: TourStageUpdateDto,
  ): Promise<any> {
    return this.profileService.updateTourStage(userId, request.stage);
  }

  // check tour stage
  @Get('check-tour-stage')
  @HttpCode(HttpStatus.OK)
  checkTourStage(@GetDecodedJwtPayload('access') userId: string ): Promise<ApiResponse<TourStageDto | null>> {
    return this.profileService.checkTourStage(userId);
  }

  // get user profile
  @Get()
  @HttpCode(HttpStatus.OK)
  getUser(@GetDecodedJwtPayload('access') userId: string ): Promise<ApiResponse<TourStageDto | null>> {
    return this.profileService.getUser(userId);
  }
}
