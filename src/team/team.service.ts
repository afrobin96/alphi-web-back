import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { Repository } from 'typeorm';
import { Member } from 'src/member/member.entity';
import { CreateTeamDTO } from './dto/create-team.dto';
import { UpdateTeamDTO } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private teamRepo: Repository<Team>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
  ) {}

  create(dto: CreateTeamDTO): Promise<Team> {
    const team = this.teamRepo.create(dto);
    return this.teamRepo.save(team);
  }

  findAll(): Promise<Team[]> {
    return this.teamRepo.find({ relations: ['members'] });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepo.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!team) throw new NotFoundException('No se encontro el equipo');
    return team;
  }

  async update(id: number, dto: UpdateTeamDTO): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, dto);
    return this.teamRepo.save(team);
  }

  async addMember(teamId: number, memberId: number) {
    const team = await this.findOne(teamId);
    const member = await this.memberRepo.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException('No se ha encontrado el miembro');
    member.team = team;
    return this.memberRepo.save(member);
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    await this.teamRepo.remove(team);
  }
}
