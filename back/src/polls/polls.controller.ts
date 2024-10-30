import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Headers } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VotesService } from 'src/votes/votes.service';
import { CreateVoteDto } from 'src/votes/dto/create-vote.dto';

@Controller('polls')
export class PollsController {
  constructor(
    private readonly pollsService: PollsService
  ) { }

  @Get()
  @HttpCode(200)
  async getPolls(@Headers('X-custom-ipuser') ipUser: string) {
    return this.pollsService.getAll(ipUser);
  }

  @Post()
  @HttpCode(200)
  async create(@Body() createPollDto: CreatePollDto) {
    const poll = await this.pollsService.create(createPollDto);
    return poll;
  }

  @Post(':id/vote')
  @HttpCode(200)
  async vote(@Param('id') pollId: string, @Body() createVoteDto: CreateVoteDto) {
    return this.pollsService.createVote(pollId, createVoteDto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string, @Headers('X-custom-ipuser') ipUser: string) {
    return this.pollsService.remove(id,ipUser);
  }

  @Post('/votes')
  @HttpCode(200)
  async refreshVotes(@Body() arrayId: string[]) {
    return this.pollsService.getVoteCountsByAnswerIds(arrayId);
  }
}
