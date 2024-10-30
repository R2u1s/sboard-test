import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Poll } from '../../polls/entities/poll.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Answer {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  text_a: string;

  @ManyToOne(() => Poll, poll => poll.ans, { onDelete: 'CASCADE' })
  poll: Poll;
}