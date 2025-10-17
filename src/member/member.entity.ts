import { Team } from 'src/team/team.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column()
  email: string;

  @ManyToOne(() => Team, (team) => team.members)
  team: Team;
}
