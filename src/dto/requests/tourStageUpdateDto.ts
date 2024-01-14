import { IsNotEmpty, IsNumber, MinLength} from 'class-validator';

export class TourStageUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  stage: number;
}
