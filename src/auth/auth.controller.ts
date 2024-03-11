import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Response
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../dto';
import { ApiResponse, ForgotPasswordDto, TokenResponse, VerifyPasswordDto } from 'src/types';
import { GetDecodedJwtPayload, PublicDecorator } from 'src/common/decorators';
import { UserDto } from 'src/dto/responses/UserDto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from 'src/dto/requests/resetPasswordDto';

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

  
  // forgot password
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @PublicDecorator()
  forgotpassword(@Body() request: ForgotPasswordDto) {
    return this.authService.forgotpassword(request);
  }

    // verify password recovery code
    @PublicDecorator()
    @Redirect('https://facebook.com',301)
    @Post('verify-password-recovery-code')
    @HttpCode(HttpStatus.OK)
    async verifypasswordcode(@Body() request: VerifyPasswordDto) {
      var response =  await this.authService.verifypasswordcode(request);
      if(!response?.data) return Redirect('https://google.com',301)
      return Redirect('https://facebook.com',301)
    } 

    // verify password recovery code
    @Post('update-password')
    @PublicDecorator()
    @HttpCode(HttpStatus.OK)
    updatepassword(@Body() request:ResetPasswordDto) {
      return this.authService.updatePassword(request);
    }
}
