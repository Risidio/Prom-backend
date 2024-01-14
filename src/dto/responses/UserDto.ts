export class UserDto{
    id:string;
    email:string;
    name:string;
    pronouns:string[];
    cinemaWorker:boolean;
    roles:string[];
    profileCompleted:boolean;
    isTourCompleted:boolean;
    tourStage:number;
    accountState:string;
    registered:Date;
    updatedAt:Date;
}