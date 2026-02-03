import { Member } from 'src/member/member.entity';
import { Project } from 'src/project/project.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Member, (member) => member.teamId)
  members: Member[];

  @OneToMany(() => Project, (project) => project.team)
  projects: Project[];
}
