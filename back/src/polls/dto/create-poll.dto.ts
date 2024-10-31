import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  text_q: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })//Применяtтся для валидации каждого элемента массива answers как строки.
  @Type(() => String)
  ans: string[];

  @IsString()
  @IsNotEmpty()
  ipUser: string;
}
