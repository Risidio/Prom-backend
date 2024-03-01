import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class AddCollaboratorDto {
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  pronouns: string[];

  @IsNotEmpty()
  @ApiProperty()
  cinemaWorker: boolean;

  @IsNotEmpty()
  @ApiProperty()
  roles: string[];

  @IsNotEmpty()
  @ApiProperty()
  accountState: string;

  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;
}
