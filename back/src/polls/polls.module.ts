import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Answer } from 'src/answers/entities/answer.entity';
import { Vote } from 'src/votes/entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Answer, Vote])],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [PollsService]
})
export class PollsModule {}
