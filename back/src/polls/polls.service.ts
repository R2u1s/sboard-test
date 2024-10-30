import { Injectable } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { Poll } from './entities/poll.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Answer } from 'src/answers/entities/answer.entity';
import { Vote } from 'src/votes/entities/vote.entity';
import { CreateVoteDto } from 'src/votes/dto/create-vote.dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollsRepository: Repository<Poll>,
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
    @InjectRepository(Vote)
    private readonly votesRepository: Repository<Vote>,
  ) { }

  async create(createPollDto: CreatePollDto) {
    const { text_q, ans, ipUser } = createPollDto;

    // Создаем вопрос
    const poll = this.pollsRepository.create({ text_q, ipUser });
    await this.pollsRepository.save(poll);

    // Создаем варианты ответов
    const answerEntities = ans.map(text => {
      return this.answersRepository.create({ text_a: text, poll });
    });

    await this.answersRepository.save(answerEntities);

    // Возвращаем объект созданного вопроса с ответами
    poll.ans = answerEntities;
    const pollWithOwner = JSON.parse(JSON.stringify(poll));
    pollWithOwner.owner = true;

    return pollWithOwner;
  }

  async createVote(pollId: string, voteDto: CreateVoteDto) {

    const id_q = pollId;
    const { id_a, ipUser } = voteDto;

    // Проверка, был ли уже голос от этого IP
    const existingVote = await this.votesRepository.findOne({
      where: {
        poll: { id: pollId },
        ipUser,
      },
    });

    if (existingVote) {
      throw new Error('Пользователь уже отвечал на этот вопрос');
    }

    const poll = await this.pollsRepository.findOne({ where: { id: id_q } });
    if (!poll) {
      throw new Error('Вопрос не найден');
    }

    const answer = await this.answersRepository.findOne({ where: { id: id_a, poll: { id: id_q } } });
    if (!answer) {
      throw new Error('Ответ не найден для данного вопроса');
    }

    const vote = this.votesRepository.create({
      poll: poll,
      ans: answer,
      ipUser: ipUser
    });
    await this.votesRepository.save(vote);

    //в ответ отправляем объект с количеством голосов в рамках данного вопроса и
    //объектом вопроса, с идентификатором выбранного ответа
    //по-хорошему нужно в отдельную функцию вынести
    const answers = await this.answersRepository.find({ where: { id: id_a, poll: { id: id_q } } });
    const votesTemp = {};

    for (const answer of answers) {
      const voteCount = await this.votesRepository.count({ where: { ans: { id: answer.id } } });
      votesTemp[answer.id] = voteCount;
    }

    const pollWithAns = JSON.parse(JSON.stringify(poll));
    pollWithAns.res_ans = answer.id;

    return {
      votes: votesTemp,
      question: pollWithAns
    };
  }

  async getAll(ip: string) {
    //запрос выводит все записи таблицы poll. При этом формирует массив привязанных ответов;
    //определяет по переданному ip является ли пользователь владельцем вопроса;
    //если пользователь отвечал на вопрос, то выводится id ответа;
    //также формируется массив votes - количество голосов для тех вопросов, на которые
    //пользователь давал ответ
    const polls = await this.pollsRepository.find({
      relations: ['ans', 'votes', 'votes.ans']
    });

    polls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    //массив вопросов
    const questions = polls.map(poll => {
      const ans = poll.ans.map(answer => ({
        id_a: answer.id,
        text_a: answer.text_a,
      }));

      const owner = poll.ipUser === ip;

      const userVote = poll.votes.find(vote => vote.ipUser === ip && vote.ans);

      const result: any = {
        id_q: poll.id,
        text_q: poll.text_q,
        ans,
        owner,
      };

      if (userVote) {
        result.res_ans = userVote.ans.id;
      }

      return result;
    });

    //массив голосов
    const votes = polls.reduce((acc, poll) => {
      const userVote = poll.votes.find(vote => vote.ipUser === ip && vote.ans);

      if (userVote) {
        poll.ans.forEach(answer => {
          const count = poll.votes.filter(vote => vote.ans.id === answer.id).length;
          if (count > 0) {
            acc[answer.id] = count;
          }
        });
      }

      return acc;
    }, {});

    return { questions, votes };
  }

  async remove(id: string, ip: string) {

    const poll = await this.pollsRepository.findOne({ where: { id: id } });
    if (poll.ipUser !== ip) {
      throw new Error('Пользователь не является владельцем вопроса');
    }

    return await this.pollsRepository.delete(id);
  }

  async getVoteCountsByAnswerIds(answerIds: string[]): Promise<Record<string, number>> {
    const votes = await this.votesRepository.find({
      where: {
        ans: {
          id: In(answerIds),
        },
      },
      relations: ['ans']
    });

    const voteCounts = votes.reduce((acc, vote) => {
      const answerId = vote.ans.id;
      acc[answerId] = (acc[answerId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return voteCounts;
  }
}
