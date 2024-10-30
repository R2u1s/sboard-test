import { Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VotesService {
  create(createVoteDto: CreateVoteDto) {
    return 'This action adds a new vote';
  }

  findAll() {
    return `This action returns all votes`;
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
