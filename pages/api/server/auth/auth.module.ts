import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import configuration from '../configuration/configuration';
import { AuthService } from './auth.service';
import { AzureADStrategy } from './azure-ad-strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV ?? 'local'}`,
      load: [configuration],
    }),
  ],
  providers: [AuthService, AzureADStrategy],
})
export class AuthModule {}
