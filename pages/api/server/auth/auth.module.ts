import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AzureADStrategy } from './azure-ad-strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, AzureADStrategy],
})
export class AuthModule {}
