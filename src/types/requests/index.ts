import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, isEmail } from "class-validator";

class AvatarcommonProp {
    @ApiProperty()
    color:string;
    @ApiProperty()
    type:string;
}

export class AvatarRequestType {
    @ApiProperty()
    skinColor:string;
    @ApiProperty()
    hair:AvatarcommonProp;
    @ApiProperty()
    top:AvatarcommonProp;
    @ApiProperty()
    bottom:AvatarcommonProp;
    @ApiProperty()
    accessory:string;
}

export class VerifyPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @ApiProperty()
    @IsNotEmpty()
    token:string;
}

export class ForgotPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email:string;
}

