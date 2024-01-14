import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileUpdateDto } from 'src/dto/requests/profileUpdateDto';
import { TourStageUpdateDto } from 'src/dto/requests/tourStageUpdateDto';
import { ApiResponse, UserDto } from 'src/types';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // update profile
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @Param() params: any,
    @Body() request: ProfileUpdateDto,
  ): Promise<ApiResponse<UserDto>> {
    return this.profileService.updateProfile(params.id, request);
  }

  // update tour stage
  @Put('stage/:id')
  @HttpCode(HttpStatus.OK)
  updateTourStage(
    @Param() params: any,
    @Body() request: TourStageUpdateDto,
  ): Promise<any> {
    return this.profileService.updateTourStage(params.id, request.stage);
  }
}
