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
    super({
      identityMetadata: `https://login.microsoftonline.com/${
        configService.get<AzureAdConfig>('azureAd').tenantId
      }/v2.0/.well-known/openid-configuration`,
      clientID: configService.get<AzureAdConfig>('azureAd').clientId,
    });
  }

  async validate(response: AzureAdResponse): Promise<AzureAdResponse> {
    if (!response || !response.aud || !response.iss) {
      return null;
    }
    const azureAdConfig = this.configService.get<AzureAdConfig>('azureAd');
    const validIssuers = azureAdConfig.issuers;
    const validAudiences = azureAdConfig.audiences;
    if (
      validAudiences.includes(response.aud) &&
      validIssuers.includes(response.iss)
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

export const FlexAzureADRestReadGuard = AuthScopes(
  { scopes: ['Flex.Rest.Read'], roles: ['ClientRead'] },
  'azure-ad'
);
export const FlexAzureADRestWriteGuard = AuthScopes(
  { scopes: ['Flex.Rest.Write'], roles: ['ClientWrite'] },
  'azure-ad'
);
export const FlexAzureADGraphQLGuard = AuthScopes(
  { scopes: ['Flex.GraphQL'], roles: ['ClientGraphQL'] },
  'azure-ad'
);
export const FlexAzureADODataGuard = AuthScopes(
  { scopes: ['Flex.OData'], roles: ['ClientOData'] },
  'azure-ad'
);
