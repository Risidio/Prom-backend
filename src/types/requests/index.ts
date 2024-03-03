import { ApiProperty } from "@nestjs/swagger";

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

