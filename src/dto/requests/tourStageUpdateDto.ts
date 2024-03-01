import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class TourStageUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  stage: number;
}
