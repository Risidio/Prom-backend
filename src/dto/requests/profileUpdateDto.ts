import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
  isNotEmpty,
  minLength,
} from 'class-validator';
import { AvatarRequestType } from 'src/types';

export class ProfileUpdateDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  pronouns: string[];

  @IsNotEmpty()
  @ApiProperty()
  avatar: AvatarRequestType;

  @IsNotEmpty()
  @ApiProperty()
  isCinemaWorker: boolean;

  @IsNotEmpty()
  @ApiProperty()
  roles: string[];
}
