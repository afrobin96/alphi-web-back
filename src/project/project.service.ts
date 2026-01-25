import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from './project.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/client/client.entity';
import { Team } from 'src/team/team.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Client) private clientRepo: Repository<Client>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
  ) {}

  create(dto: CreateProjectDto) {
    const project = this.projectRepo.create({ ...dto, status: 'active' });
    return this.projectRepo.save(project);
  }

  findAll() {
    return this.projectRepo.find({ relations: ['client', 'team'] });
  }

  async findOne(id: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['client', 'team', 'tasks'],
    });
    if (!project) throw new NotFoundException('project not found');
    return project;
  }

  async update(id: number, dto: UpdateProjectDto) {
    const project = await this.findOne(id);
    // Actualizar propiedades básicas
    if (dto.name) project.name = dto.name;
    if (dto.description !== undefined) project.description = dto.description;
    if (dto.status) project.status = dto.status;

    // Manejar clientId
    if (dto.clientId || dto.clientId === null) {
      if (dto.clientId === null) {
        project.client = null;
      } else {
        const client = await this.clientRepo.findOne({
          where: { id: dto.clientId },
        });
        if (!client) throw new BadRequestException('Client not found');
        project.client = client;
      }
    }
    // Manejar teamId
    if (dto.teamId || dto.teamId === null) {
      if (dto.teamId === null) {
        project.team = null;
      } else {
        const team = await this.teamRepo.findOne({ where: { id: dto.teamId } });
        if (!team) throw new BadRequestException('Team not found');
        project.team = team;
      }
    }

    return this.projectRepo.save(project);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    return this.projectRepo.remove(project);
  }

  async assignTeam(projectId: number, teamId: number) {
    const project = await this.findOne(projectId);
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) throw new BadRequestException('Team not found');
    project.team = team;
    return this.projectRepo.save(project);
  }

  async assingClient(projectId: number, clientId: number) {
    const project = await this.findOne(projectId);
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) throw new BadRequestException('Client not found');
    project.client = client;
    return this.projectRepo.save(project);
  }

  async completeProject(id: number) {
    const project = await this.findOne(id);
    project.status = 'completed';
    project.completedAt = new Date();
    return this.projectRepo.save(project);
  }

  async setStatus(id: number, status: ProjectStatus) {
    const project = await this.findOne(id);
    project.status = status;
    if (status === 'completed') project.completedAt = new Date();
    return this.projectRepo.save(project);
  }
}
