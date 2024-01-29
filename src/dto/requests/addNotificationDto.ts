import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class AddNotificationDto {

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  read: boolean;

  @IsNotEmpty()
  state:string

  @IsNotEmpty()
  createdAt: Date

  @IsNotEmpty()
  type: string

  @IsNotEmpty()
  userId: string
}

