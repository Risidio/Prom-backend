import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { AvatarRequestType } from "src/types";

export class UserDto{
    @ApiProperty()
    id:string;
    @ApiProperty()
    email:string;
    @ApiProperty()
    name:string;
    @ApiProperty()
    pronouns:string[];
    @ApiProperty()
    cinemaWorker:boolean;
    @ApiProperty()
    roles:string[];
    @ApiProperty()
    profileCompleted:boolean;
    @ApiProperty()
    isTourComplete:boolean;
    @ApiProperty()
    tourStage:number;
    @ApiProperty()
    accountState:string;
    @ApiProperty()
    token:string;
    @ApiProperty()
    registered:Date;
    @ApiProperty()
    updatedAt:Date;
    @IsNotEmpty()
    @ApiProperty()
    avatar?: AvatarRequestType;
}
