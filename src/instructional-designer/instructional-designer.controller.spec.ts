import { Test, TestingModule } from '@nestjs/testing';
import { InstructionalDesignerController } from './instructional-designer.controller';

describe('InstructionalDesignerController', () => {
  let controller: InstructionalDesignerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructionalDesignerController],
    }).compile();

    controller = module.get<InstructionalDesignerController>(InstructionalDesignerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
