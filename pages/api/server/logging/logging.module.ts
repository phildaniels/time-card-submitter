import { Module } from '@nestjs/common';
import { AppInsightsLogger } from './app-insights.logger';

@Module({
  providers: [AppInsightsLogger],
  exports: [AppInsightsLogger],
})
export class LoggingModule {}
