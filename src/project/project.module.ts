import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Client } from 'src/client/client.entity';
import { Team } from 'src/team/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Client, Team])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
