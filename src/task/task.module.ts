import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Project } from 'src/project/project.entity';
import { Member } from 'src/member/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, Member])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
