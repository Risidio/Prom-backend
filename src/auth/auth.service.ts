import {
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { ApiResponse, TokenResponse} from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import * as _ from 'lodash';
import { UserDto } from 'src/dto/responses/UserDto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async hashData(data: string) {
    return await bcrypt.hash(data, Number(env.BCRYPT_SALT));
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
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: signUpRequest.email,
        },
      });

      if (existingUser)
        throw new ForbiddenException('Already registered. Sign In');

      const hashedPassword = await this.hashData(signUpRequest.password);

      const newUser = this.prisma.user.create({
        data: {
          id: uuidV4(),
          email: signUpRequest.email,
          password: hashedPassword,
          name: '',
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
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occured while signing up.',
        data: null,
      };
    }
  }

  async login(signInRequest: AuthDto): Promise<ApiResponse<UserDto>> {
    try {
      let data;

      const user = await this.prisma.user.findUnique({
        where: {
          email: signInRequest.email,
        },
      });

      if (!user) throw new ForbiddenException('Access Denied!');

      const passwordMatches = await bcrypt.compare(
        signInRequest.password,
        user.password,
      );

      if (!passwordMatches) throw new ForbiddenException('Access Denied!');

      try {
        await this.jwtService.verifyAsync(user?.token, {
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

        data.token = tokenResponse?.token;

        return {
          code: HttpStatus.OK,
          message: 'Successful',
          data,
        };
      }
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occured while logging in',
        data: null,
      };
    }
  }

  async logout(userId: string): Promise<ApiResponse<boolean>> {
    try {
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          token: {
            not: null,
          },
        },
        data: {
          token: null,
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
}
