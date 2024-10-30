import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/config';
import { DatabaseConfigFactory } from './config/config.factory';
import { PollsModule } from './polls/polls.module';
import { AnswersModule } from './answers/answers.module';
import { VotesModule } from './votes/votes.module';
import { TempsModule } from './temps/temps.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делает модуль доступным во всем приложении
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigFactory
    }),
    PollsModule,
    AnswersModule,
    VotesModule,
    TempsModule,
  ]
})
export class AppModule {}
