import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Answer } from '../../answers/entities/answer.entity';
import { Vote } from '../../votes/entities/vote.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Poll {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  text_q: string;

  @Column()
  ipUser: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Answer, answer => answer.poll)
  ans: Answer[];

  @OneToMany(() => Vote, vote => vote.poll)
  votes: Vote[];
}