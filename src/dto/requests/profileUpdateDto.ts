import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
  isNotEmpty,
  minLength,
} from 'class-validator';

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
  isCinemaWorker: boolean;

  @IsNotEmpty()
  @ApiProperty()
  roles: string[];
}
