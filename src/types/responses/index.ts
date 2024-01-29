import { HttpStatus } from "@nestjs/common"

export type ApiResponse<T> = {
    code:HttpStatus,
    message:string,
    data:T
}

// export type UserDto = {
//     id:string,
//     email:string,
//     name:string,
//     pronouns:string[],
//     cinemaWorker:boolean,
//     roles:string[],
//     profileCompleted:boolean,
//     isTourCompleted:boolean,
//     tourStage:number,
//     accountState:string,
//     registered:Date,
//     updatedAt:Date
// }

export type CollaboratorDto = {
    id:string,
    email:string,
    name:string,
    pronouns:string[],
    cinemaWorker:boolean,
    roles:string[],
    accountState:string,
}

export type TourStageDto = {
    tourStage:number
}

export type PaginatedResults<T> = {
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    items:T[]
}

export type NotificationsDto = {
    id: string,
    userId: string,
    message: string,
    read:boolean,
    state:string,
    createdAt: Date,
    updatedAt: Date,
    type:string
}