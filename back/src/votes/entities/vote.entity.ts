import { Entity, PrimaryColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Poll } from '../../polls/entities/poll.entity';
import { Answer } from '../../answers/entities/answer.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Vote {
  @PrimaryColumn()
  id: string = uuidv4();

  @ManyToOne(() => Poll, poll => poll.votes, { onDelete: 'CASCADE' })
  poll: Poll;

  @ManyToOne(() => Answer, answer => answer.id)
  ans: Answer;

  @Column()
  ipUser: string;

  @CreateDateColumn()
  votedAt: Date;
}