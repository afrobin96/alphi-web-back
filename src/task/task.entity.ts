import { Member } from 'src/member/member.entity';
import { Project } from 'src/project/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  status:
    | 'to_do'
    | 'in_review'
    | 'reopened'
    | 'completed'
    | 'payment_pending'
    | 'paid';

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(() => Member, { onDelete: 'SET NULL' })
  member: Member;
}
