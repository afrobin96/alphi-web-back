import {
  BadRequestException,
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AssignDto } from './dto/assign.dto';
import { ProjectStatus } from './project.entity';

@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProjectDto) {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }

  // Assign team.
  @Post(':id/team')
  assignTeam(@Param('id', ParseIntPipe) id: number, @Body() body: AssignDto) {
    return this.projectService.assignTeam(id, body.id);
  }

  // Assign client
  @Post(':id/client')
  assignClient(@Param('id', ParseIntPipe) id: number, @Body() body: AssignDto) {
    return this.projectService.assingClient(id, body.id);
  }

  // Complete project
  @Post(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.completeProject(id);
  }

  // Set status
  @Post(':id/status/:status')
  setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string,
  ) {
    const allowed = ['active', 'completed', 'cancelled'];
    if (!allowed.includes(status))
      throw new BadRequestException('Invalid status');
    return this.projectService.setStatus(id, status as ProjectStatus);
  }
}
