import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';
import { NextApiHandler } from 'next';
import { INestApplication, NestApplicationOptions } from '@nestjs/common';
import { AppInsightsLogger } from './logging/app-insights.logger';
import { AppInsightsService } from './logging/app-insights.service';
import { ConfigService } from '@nestjs/config';
import { Config } from './configuration/config.model';

export module Backend {
  let app: INestApplication;

  export async function getApp(
    options: NestApplicationOptions = {
      bodyParser: false,
      logger: false,
    }
  ): Promise<INestApplication> {
    if (!app) {
      app = await NestFactory.create(AppModule, options);
      const appInsightsLogger = new AppInsightsLogger(
        new AppInsightsService(app.get<ConfigService<Config>>(ConfigService))
      );
      app.useLogger(appInsightsLogger);
      app.enableCors();
      app.setGlobalPrefix('api');
      await app.init();
    }
    return app;
  }

  export async function bootstrap(
    options?: NestApplicationOptions
  ): Promise<void> {
    const app = await getApp(options);
    await app.listen(3001);
  }

  export async function getListener(
    options?: NestApplicationOptions
  ): Promise<NextApiHandler<any>> {
    const app = await getApp(options);
    const server: http.Server = app.getHttpServer();
    const [listener] = server.listeners('request') as NextApiHandler[];
    return listener;
  }
}
