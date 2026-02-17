import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/project/project.entity';
import { Member } from 'src/member/member.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
  ) {}

  create(dto: CreateTaskDto) {
    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      value: dto.value,
    });

    if (dto.projectId) {
      task.project = { id: dto.projectId } as Project;
    }

    if (dto.memberId) {
      task.member = { id: dto.memberId } as Member;
    }

    return this.taskRepo.save(task).then(() => this.findOne(task.id));
  }

  findAll() {
    return this.taskRepo.find({ relations: ['project', 'member'] });
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['project', 'member'],
    });

    if (!task) {
      throw new NotFoundException('No se encontro tarea');
    }

    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id);

    Object.assign(task, {
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      value: dto.value ?? task.value,
    });

    if (dto.projectId !== undefined) {
      if (dto.projectId === null) {
        task.project = null;
      } else {
        const project = await this.projectRepo.findOne({
          where: { id: dto.projectId },
        });

        if (!project) {
          throw new BadRequestException('No se encontro proyecto');
        }
        task.project = project;
      }
    }

    if (dto.memberId !== undefined) {
      if (dto.memberId === null) {
        task.member = null;
      } else {
        const member = await this.memberRepo.findOne({
          where: { id: dto.memberId },
        });

        if (!member) {
          throw new BadRequestException('No se encontro Miembro');
        }
        task.member = member;
      }
    }

    await this.taskRepo.save(task);
    return this.findOne(id);
  }

  async remove(id: number) {
    const task = await this.findOne(id);

    return this.taskRepo.remove(task);
  }

  async assignMember(id: number, memberId: number | null) {
    const task = await this.findOne(id);

    if (memberId === null) {
      task.member = null;
    } else {
      const member = await this.memberRepo.findOne({ where: { id: memberId } });

      if (!member) {
        throw new BadRequestException('No se encontro miembro');
      }

      task.member = member;
    }

    await this.taskRepo.save(task);
    return this.findOne(id);
  }

  async assignProject(id: number, projectId: number | null) {
    const task = await this.findOne(id);

    if (projectId === null) {
      task.project = null;
    } else {
      const project = await this.projectRepo.findOne({
        where: { id: projectId },
      });

      if (!project) {
        throw new BadRequestException('No se encontro proyecto');
      }

      task.project = project;
    }

    await this.taskRepo.save(task);
    return this.findOne(id);
  }

  async changeStatus(id: number, status: string) {
    const allowed = [
      'to_do',
      'in_course',
      'in_review',
      'reopened',
      'completed',
      'payment_pending',
      'paid',
    ];

    if (!allowed.includes(status)) {
      throw new BadRequestException('El estado no es permitido');
    }

    const task = await this.findOne(id);

    task.status = status as TaskStatus;
    await this.taskRepo.save(task);
    return this.findOne(id);
  }
}
