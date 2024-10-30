import { IsNotEmpty, IsIP, IsString } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  id_q: string;

  @IsString()
  @IsNotEmpty()
  id_a: string;

  @IsIP()
  @IsNotEmpty()
  ipUser: string;
}
