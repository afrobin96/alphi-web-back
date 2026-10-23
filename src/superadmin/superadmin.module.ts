import { Module } from '@nestjs/common';
import { SuperadminController } from './superadmin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { SuperadminService } from './superadmin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SuperadminController],
  providers: [SuperadminService],
})
export class SuperadminModule {}
