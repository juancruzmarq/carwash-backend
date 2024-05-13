import { Test, TestingModule } from '@nestjs/testing';
import { CarwashService } from '../carwash.service';

describe('CarwashService', () => {
  let service: CarwashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarwashService],
    }).compile();

    service = module.get<CarwashService>(CarwashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
