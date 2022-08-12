import { BearerStrategy } from 'passport-azure-ad';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AzureAdConfig, Config } from '../configuration/config.model';
import { AuthScopes } from './AuthScopes';

@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad'
) {
  constructor(private configService: ConfigService<Config>) {
    console.log(
      `🚀 ~ file: azure-ad-strategy.ts ~ line 14 ~ constructor ~ configService`,
      configService,
      `process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID`,
      process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID
    );
    const superParams = {
      identityMetadata: `https://login.microsoftonline.com/${
        configService?.get<AzureAdConfig>('azureAd')?.tenantId ??
        process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID
      }/v2.0/.well-known/openid-configuration`,
      clientID:
        configService?.get<AzureAdConfig>('azureAd')?.clientId ??
        process.env.TEMPUS_AZURE_AD_CLIENT_ID,
    };
    console.log(
      `🚀 ~ file: azure-ad-strategy.ts ~ line 31 ~ constructor ~ superParams`,
      superParams
    );
    super(superParams);
  }

  async validate(response: AzureAdResponse): Promise<AzureAdResponse | null> {
    console.log(
      `🚀 ~ file: azure-ad-strategy.ts ~ line 28 ~ validate ~ response`,
      response
    );
    if (!response || !response.aud || !response.iss) {
      return null;
    }
    const azureAdConfig = this.configService.get<AzureAdConfig>('azureAd');
    const validIssuers = azureAdConfig?.issuers;
    console.log(
      `🚀 ~ file: azure-ad-strategy.ts ~ line 37 ~ validate ~ validIssuers`,
      validIssuers
    );
    const validAudiences = azureAdConfig?.audiences;
    console.log(
      `🚀 ~ file: azure-ad-strategy.ts ~ line 39 ~ validate ~ validAudiences`,
      validAudiences
    );

    if (
      validAudiences?.includes(response.aud) &&
      validIssuers?.includes(response.iss)
    ) {
      return response;
    }
    return null;
  }
}

export interface AzureAdResponse {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  azp: string;
  azpacr: string;
  ipaddr: string;
  name: string;
  oid: string;
  preferred_username: string;
  rh: string;
  scp: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
  roles?: string[];
}

export const TempusReadGuard = AuthScopes(
  { scopes: ['Flex.Read'], roles: ['ClientFlexRead'] },
  'azure-ad'
);
export const TempusWriteGuard = AuthScopes(
  { scopes: ['Flex.Write'], roles: ['ClientFlexWrite'] },
  'azure-ad'
);
