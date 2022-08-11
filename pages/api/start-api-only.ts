import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './server/app.module';
import { Config } from './server/configuration/config.model';
import { AppInsightsLogger } from './server/logging/app-insights.logger';
import { AppInsightsService } from './server/logging/app-insights.service';
import { Backend } from './server/main';

async function bootstrap(): Promise<void> {
  try {
    await Backend.bootstrap({});
  } catch (err) {
    throw err;
  }
}

bootstrap();
