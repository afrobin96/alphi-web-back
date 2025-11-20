import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { Team } from 'src/team/team.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
  ) {}

  async create(dto: CreateMemberDto) {
    const member = this.memberRepo.create({
      name: dto.name,
      email: dto.email,
      role: dto.rol,
    });

    const saved = await this.memberRepo.save(member);

    if (dto.teamId) {
      await this.assignTeam(saved.id, dto.teamId);
      return this.findOne(saved.id);
    }

    return this.findOne(saved.id);
  }

  findAll() {
    return this.memberRepo.find({ relations: ['team'] });
  }

  async findOne(id: number) {
    const member = await this.memberRepo.findOne({
      where: { id },
      relations: ['team'],
    });
    if (!member) {
      throw new NotFoundException('Miembro no encontrado');
    }
    return member;
  }

  async update(id: number, dto: UpdateMemberDto) {
    const member = await this.findOne(id);
    Object.assign(member, {
      name: dto.name ?? member.name,
      role: dto.rol ?? member.role,
      email: dto.email ?? member.email,
    });

    await this.memberRepo.save(member);
    if (dto.teamId !== undefined) {
      await this.assignTeam(id, dto.teamId);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const member = await this.findOne(id);
    return this.memberRepo.remove(member);
  }

  async assignTeam(memberId: number, teamId: number) {
    const member = await this.findOne(memberId);
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new BadRequestException('No se encuentra el equipo');
    }
    member.team = team;
    await this.memberRepo.save(member);
    return this.findOne(memberId);
  }
}
