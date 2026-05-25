import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum EducationLevel {
  BASIC = 'básico',
  INTERMEDIATE = 'intermedio',
  ADVANCED = 'avanzado',
  UNIVERSITY = 'universitario',
  PROFESSIONAL = 'profesional',
}

export enum KnowledgeArea {
  MEDICINE = 'medicina',
  ENGINEERING = 'ingeniería',
  LAW = 'derecho',
  TECHNOLOGY = 'tecnología',
  BUSINESS = 'negocios',
  EDUCATION = 'educación',
  ARTS = 'artes',
  SCIENCES = 'ciencias',
  SOCIAL = 'ciencias sociales',
  OTHER = 'otro',
}

export class CreateInstructionalDto {
  @IsString()
  @IsNotEmpty()
  topic!: string; // "Anatomía del corazón"

  @IsEnum(EducationLevel)
  educationLevel!: EducationLevel;

  @IsString()
  @IsNotEmpty()
  targetAudience!: string; // "Estudiantes de primer año de medicina"

  @IsEnum(KnowledgeArea)
  knowledgeArea!: KnowledgeArea;
}
