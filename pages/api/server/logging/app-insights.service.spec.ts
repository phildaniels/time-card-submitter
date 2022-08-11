import { Test, TestingModule } from '@nestjs/testing';
import { AppInsightsService } from './app-insights.service';

describe('AppInsightsService', () => {
  let service: AppInsightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppInsightsService],
    }).compile();

    service = module.get<AppInsightsService>(AppInsightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
