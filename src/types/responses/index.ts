import { HttpStatus } from "@nestjs/common"

export type ApiResponse<T> = {
    code:HttpStatus,
    message:string,
    data:T
}

export type UserDto = {
    id:string,
    email:string,
    name:string,
    pronouns:string[],
    cinemaWorker:boolean,
    roles:string[],
    profileCompleted:boolean,
    isTourCompleted:boolean,
    tourStage:number,
    accountState:string,
    registered:Date,
    updatedAt:Date
}