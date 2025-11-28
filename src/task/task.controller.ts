import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignMemberDto } from './dto/assign-member.dto';
import { AssignProjectDto } from './dto/assign-project.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('task')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }

  @Post(':id/member')
  assignMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignMemberDto,
  ) {
    return this.taskService.assignMember(id, dto.memberId);
  }

  @Post(':id/project')
  assignProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignProjectDto,
  ) {
    return this.taskService.assignProject(id, dto.projectId);
  }

  @Post(':id/status')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.taskService.changeStatus(id, dto.status);
  }
}
