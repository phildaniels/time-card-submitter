import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from './logging/logging.module';
import configuration from './configuration/configuration';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV ?? 'local'}`,
      load: [configuration],
    }),
    AuthModule,
    LoggingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
