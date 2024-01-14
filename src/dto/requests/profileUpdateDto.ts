import { IsAlphanumeric, IsEmail, IsNotEmpty, MinLength, isNotEmpty, minLength } from 'class-validator';

export class ProfileUpdateDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  pronouns: string[];

  @IsNotEmpty()
  isCinemaWorker: boolean;

  @IsNotEmpty()
  roles:string[];
}
