import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class AnswersService {
  create(createAnswerDto: CreateAnswerDto) {
    return 'This action adds a new answer';
  }
}
