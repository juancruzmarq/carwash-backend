import { Test, TestingModule } from '@nestjs/testing';
import { CarwashController } from '../carwash.controller';

describe('CarwashController', () => {
  let controller: CarwashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarwashController],
    }).compile();

    controller = module.get<CarwashController>(CarwashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
