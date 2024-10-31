import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  text_a: string;
}
