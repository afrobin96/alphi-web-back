import { Member } from 'src/member/member.entity';
import { Project } from 'src/project/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export type TaskStatus =
  | 'to_do'
  | 'in_review'
  | 'reopened'
  | 'completed'
  | 'payment_pending'
  | 'paid';
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({
    type: 'enum',
    enum: [
      'to_do',
      'in_review',
      'reopened',
      'completed',
      'payment_pending',
      'paid',
    ],
    default: 'to_do',
  })
  status: TaskStatus;

  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  project: Project;

  @ManyToOne(() => Member, { onDelete: 'SET NULL' })
  member: Member;
}
