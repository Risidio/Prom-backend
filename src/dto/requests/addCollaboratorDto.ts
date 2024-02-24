import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class AddCollaboratorDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  pronouns:string[]

  @IsNotEmpty()
  cinemaWorker: boolean

  @IsNotEmpty()
  roles:string[]

  @IsNotEmpty()
  accountState: string

  @IsNotEmpty()
  phoneNumber: string
}
