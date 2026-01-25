import { Client } from 'src/client/client.entity';
import { Task } from 'src/task/task.entity';
import { Team } from 'src/team/team.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type ProjectStatus = 'active' | 'completed' | 'cancelled';
@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  })
  status: ProjectStatus;

  @ManyToOne(() => Client, (client) => client.projects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  client: Client | null;

  @ManyToOne(() => Team, (team) => team.projects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  team: Team | null;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;
}
