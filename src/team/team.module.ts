import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { Member } from 'src/member/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Member])],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
