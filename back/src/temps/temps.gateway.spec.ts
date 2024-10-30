import { Test, TestingModule } from '@nestjs/testing';
import { TempsGateway } from './temps.gateway';
import { TempsService } from './temps.service';

describe('TempsGateway', () => {
  let gateway: TempsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempsGateway, TempsService],
    }).compile();

    gateway = module.get<TempsGateway>(TempsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
