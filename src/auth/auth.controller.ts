import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../dto';
import { ApiResponse, TokenResponse } from 'src/types';
import { GetDecodedJwtPayload, PublicDecorator } from 'src/common/decorators';
import { UserDto } from 'src/dto/responses/UserDto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // sign up
  @PublicDecorator()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpRequest: AuthDto): Promise<ApiResponse<TokenResponse>>{
    return this.authService.signUp(signUpRequest);
  }

  // log in
  @PublicDecorator()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() signInRequest: AuthDto): Promise<ApiResponse<UserDto>> {
    return this.authService.login(signInRequest);
  }

  // log out
  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  logout(@GetDecodedJwtPayload('access') userId: string) {
    return this.authService.logout(userId);
  }

}
