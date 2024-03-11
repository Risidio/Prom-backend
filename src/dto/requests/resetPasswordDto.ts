import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  MinLength,
  isEmail,
} from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;
  }
