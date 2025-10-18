import { Client } from 'src/client/client.entity';
import { Task } from 'src/task/task.entity';
import { Team } from 'src/team/team.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: 'active' | 'completed' | 'cancelled';

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @OneToMany(() => Client, (client) => client.projects)
  client: Client;

  @ManyToOne(() => Team, (team) => team.projects, { onDelete: 'SET NULL' })
  team: Team;

  @ManyToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
