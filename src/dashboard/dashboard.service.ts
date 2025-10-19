import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { Member } from 'src/member/member.entity';
import { Payment } from 'src/payment/payment.entity';
import { Project } from 'src/project/project.entity';
import { Task } from 'src/task/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  async getSummary() {
    const [
      projectsActive,
      clients,
      members,
      tasksPending,
      taskCompleted,
      paymentPending,
    ] = await Promise.all([
      this.projectRepository.count({ where: { status: 'active' } }),
      this.clientRepository.count(),
      this.memberRepository.count(),
      this.taskRepository.count({ where: { status: 'to_do' } }),
      this.taskRepository.count({ where: { status: 'completed' } }),
      this.paymentRepository.count({ where: { status: 'pending' } }),
    ]);

    return {
      projectsActive,
      clients,
      members,
      tasksPending,
      taskCompleted,
      paymentPending,
    };
  }
}
