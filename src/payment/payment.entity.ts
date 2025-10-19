import { Member } from 'src/member/member.entity';
import { Task } from 'src/task/task.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member, { onDelete: 'SET NULL' })
  member: Member;

  @ManyToMany(() => Task)
  @JoinTable()
  tasks: Task[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'cancelled';

  @Column({ nullable: true })
  note: string;
}
