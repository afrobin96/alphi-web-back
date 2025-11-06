import { PartialType } from '@nestjs/swagger';
import { CreateTeamDTO } from './create-team.dto';

export class UpdateTeamDTO extends PartialType(CreateTeamDTO) {}
