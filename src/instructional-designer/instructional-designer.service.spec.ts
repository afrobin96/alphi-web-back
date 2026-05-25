import { Test, TestingModule } from '@nestjs/testing';
import { InstructionalDesignerService } from './instructional-designer.service';

describe('InstructionalDesignerService', () => {
  let service: InstructionalDesignerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstructionalDesignerService],
    }).compile();

    service = module.get<InstructionalDesignerService>(InstructionalDesignerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
