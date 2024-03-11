import {
  BadRequestException,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prismaClientService/prisma.service';
var bcp = require('bcryptjs');
import { v4 as uuidV4 } from 'uuid';
import {
  ApiResponse,
  ForgotPasswordDto,
  TokenResponse,
  VerifyPasswordDto,
} from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import * as _ from 'lodash';
import { UserDto } from 'src/dto/responses/UserDto';
import { MailService } from 'src/mail/mail.service';
import { ok } from 'assert';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ResetPasswordDto } from 'src/dto/requests/resetPasswordDto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async hashData(data: string) {
    var salt = bcp.genSaltSync(Number(env.BCRPTY_SALT));
    var hash = bcp.hashSync(data, salt);
    return hash;
  }

  async generateToken(userId: string, email: string): Promise<TokenResponse> {
    const accessToken = await this.jwtService.signAsync(
      {
        access: userId,
        email,
      },
      {
        expiresIn: `${env.JWT_EXPIRATION}`,
        secret: env.JWT_SECRET,
      },
    );

    return { token: accessToken };
  }

  async updateToken(userId: string, token: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        token,
      },
    });
  }

  async signUp(signUpRequest: AuthDto): Promise<ApiResponse<TokenResponse>> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: signUpRequest.email,
      },
    });

    if (existingUser)
      throw new ForbiddenException({
        message: 'An account has already been created for this email.',
        code: HttpStatus.FORBIDDEN,
        data: null,
      });

    const hashedPassword = await this.hashData(signUpRequest.password);

    const newUser = this.prisma.user.create({
      data: {
        id: uuidV4(),
        email: signUpRequest.email,
        password: hashedPassword,
        name: '',
        collaborators: '',
      },
    });

    const tokenResponse = await this.generateToken(
      (await newUser).id,
      (await newUser).email,
    );

    await this.updateToken((await newUser).id, tokenResponse.token);

    return {
      code: HttpStatus.CREATED,
      message: 'Successful',
      data: tokenResponse,
    };
  }

  async login(signInRequest: AuthDto): Promise<ApiResponse<UserDto>> {
    let data;

    const user = await this.prisma.user.findUnique({
      where: {
        email: signInRequest.email,
      },
    });

    if (!user)
      throw new ForbiddenException({
        message: 'Access Denied',
        code: HttpStatus.FORBIDDEN,
        data: null,
      });

    const passwordMatches = await bcp.compareSync(
      signInRequest.password,
      user.password,
    );

    if (!passwordMatches)
      throw new ForbiddenException({
        message: 'Invalid credentials',
        code: HttpStatus.FORBIDDEN,
        data: null,
      });

    try {
      var verifyResponse = await this.jwtService.verifyAsync(user?.token, {
        secret: env.JWT_SECRET,
      });

      data = _.pick(user, [
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
        data,
      };
    } catch (error) {
      const tokenResponse = await this.generateToken(user.id, user.email);

      await this.updateToken(user.id, tokenResponse.token);

      user.token = tokenResponse?.token;

      return {
        code: HttpStatus.OK,
        message: 'Successful',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          pronouns: user.pronouns,
          cinemaWorker: user.cinemaWorker,
          roles: user.roles,
          profileCompleted: user.profileCompleted,
          isTourComplete: user.isTourComplete,
          tourStage: user.tourStage,
          accountState: user.accountState,
          registered: user.registered,
          token: user.token,
          updatedAt: user.updatedAt,
        },
      };
    }
  }

  async logout(userId: string): Promise<ApiResponse<boolean>> {
    try {
      this.jwtService;

      await this.prisma.user.updateMany({
        where: {
          id: userId,
          token: {
            not: null,
          },
        },
        data: {
          token: '',
        },
      });

      return {
        code: HttpStatus.OK,
        message: 'Successful',
        data: null,
      };
    } catch (error) {
      console.log(error);

      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occured while logging out',
        data: null,
      };
    }
  }

  async forgotpassword(
    request: ForgotPasswordDto,
  ): Promise<ApiResponse<boolean>> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: request.email,
      },
    });

    if (!existingUser)
      throw new ForbiddenException({
        message: "You don't have an account. Register to create an account.",
        code: HttpStatus.FORBIDDEN,
        data: null,
      });

    let code = uuidV4;

    let token = await this.jwtService.signAsync(
      {
        email: request.email,
      },
      {
        expiresIn: process.env.RESET_PASSWORD_EXPIRATION,
        secret: process.env.RESET_PASSWORD_SECRET,
      },
    );

    const newRecoveryCode = this.prisma.recoveryCode.create({
      data: {
        id: code.toString(),
        email: request.email,
        token,
      },
    });

    await this.mailService.SendMail({ email: request.email, token });

    return {
      code: HttpStatus.OK,
      message: 'Successful sent a password reset email.',
      data: true,
    };
  }

  async verifypasswordcode(
    request: VerifyPasswordDto,
  ): Promise<ApiResponse<boolean>> {
    const passwordRecoveryCode = await this.prisma.recoveryCode.findUnique({
      where: {
        token: request.token,
      },
    });

    if (!passwordRecoveryCode)
      throw new NotFoundException({
        code: HttpStatus.NOT_FOUND,
        message: 'Invalid password token not found.',
        data: false,
      });

    const user = await this.prisma.user.findUnique({
      where: {
        email: request.email,
      },
    });

    if (!user)
      throw new ForbiddenException({
        code: HttpStatus.FORBIDDEN,
        message: 'Reset password denied.',
        data: false,
      });

    try {
      let verifytoken = await this.jwtService.verifyAsync(request.email, {
        secret: process.env.RESET_PASSWORD_SECRET,
      });

      return {
        code: HttpStatus.OK,
        message: 'Password recovery verified.',
        data: true,
      };
    } catch (error) {
      console.log(error);

      throw new PreconditionFailedException({
        code: HttpStatus.PRECONDITION_FAILED,
        message:
          'An error occured while verifying the password reset credentials.',
        data: false,
      });
    }
  }

  async updatePassword(
    request: ResetPasswordDto,
  ): Promise<ApiResponse<boolean>> {
    const passwordRecoveryCode = false;

    const user = await this.prisma.user.findUnique({
      where: {
        email: request.email,
      },
    });

    if (!user)
      throw new ForbiddenException({
        message: "You don't have an account. Register to create an account.",
        code: HttpStatus.FORBIDDEN,
        data: false,
      });

    var newHashedPassword = await this.hashData(request.password);

    if (!newHashedPassword)
      throw new PreconditionFailedException({
        message: "Couldn't update user's password.",
        code: HttpStatus.PRECONDITION_FAILED,
        data: false,
      });

    var updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newHashedPassword,
        updatedAt: new Date(),
      },
    });

    if (!updatedUser)
      throw new PreconditionFailedException({
        message: "Couldn't update user's password.",
        code: HttpStatus.PRECONDITION_FAILED,
        data: false,
      });

    return {
      code: HttpStatus.OK,
      message: 'Password updated successfully.',
      data: true,
    };
  }
}
