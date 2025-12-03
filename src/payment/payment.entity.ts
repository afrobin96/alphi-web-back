import { Member } from 'src/member/member.entity';
import { Project } from 'src/project/project.entity';
import { Task } from 'src/task/task.entity';
import {
  Column,
  CreateDateColumn,
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

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  member: Member;

  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  project: Project;

  @ManyToMany(() => Task)
  @JoinTable()
  tasks: Task[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'cancelled';

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;
}
