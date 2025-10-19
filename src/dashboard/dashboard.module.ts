import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/project/project.entity';
import { Client } from 'src/client/client.entity';
import { Task } from 'src/task/task.entity';
import { Member } from 'src/member/member.entity';
import { Payment } from 'src/payment/payment.entity';
import { Team } from 'src/team/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Client, Task, Member, Payment, Team]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
