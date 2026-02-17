/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/task/task.entity';
import { Project } from 'src/project/project.entity';
import { Member } from 'src/member/member.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
  ) {}

  findAll() {
    return this.paymentRepo.find({ relations: ['member', 'project'] });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['member', 'project', 'tasks'],
    });

    if (!payment) throw new NotFoundException('no se encontro el pago');

    return payment;
  }

  async calculateAmount(projectId: number, memberId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    const member = await this.memberRepo.findOne({ where: { id: memberId } });

    if (!project) throw new BadRequestException('no se encontro proyecto');
    if (!member) throw new BadRequestException('no se encontro miembro');

    const tasks = await this.taskRepo.find({
      where: {
        project: { id: projectId } as any,
        member: { id: memberId } as any,
        status: 'completed',
      },
      relations: ['project', 'member'],
    });

    const total = tasks.reduce(
      (subtotal, task) => subtotal + Number(task.value),
      0,
    );

    return { total, tasks };
  }

  async create(dto: CreatePaymentDto) {
    const { projectId, memberId, note } = dto;

    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    const member = await this.memberRepo.findOne({ where: { id: memberId } });

    if (!project) throw new BadRequestException('no se encontro proyecto');
    if (!member) throw new BadRequestException('no se encontro miembro');

    const tasks = await this.taskRepo.find({
      where: {
        project: { id: projectId } as any,
        member: { id: memberId } as any,
        status: 'completed',
      },
    });

    const total = tasks.reduce(
      (subtotal, task) => subtotal + Number(task.value),
      0,
    );

    const payment = this.paymentRepo.create({
      member,
      project,
      tasks,
      total,
      note,
      status: 'pending',
    });

    return this.paymentRepo.save(payment);
  }

  async changeStatus(id: number, dto: ChangeStatusDto) {
    const payment = await this.findOne(id);

    payment.status = dto.status;

    return this.paymentRepo.save(payment);
  }

  async remove(id: number) {
    const payment = await this.findOne(id);

    return this.paymentRepo.remove(payment);
  }

  async getMembersForProject(projectId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['team', 'team.members'],
    });

    if (!project) throw new BadRequestException('no se encontro proyecto');

    const membersFromTeam = project?.team?.members ?? [];

    const tasks = await this.taskRepo.find({
      where: {
        project: { id: projectId } as any,
      },
      relations: ['member'],
    });

    const membersFromTasks = tasks
      .map((task) => task.member)
      .filter((member): member is Member => member !== null);

    const map = new Map<number, Member>();
    membersFromTeam.forEach((member) => map.set(member.id, member));
    membersFromTasks.forEach((member) => map.set(member.id, member));

    return Array.from(map.values());
  }
}
