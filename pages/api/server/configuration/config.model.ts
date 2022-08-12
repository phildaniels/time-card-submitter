import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';

export interface Config {
  azureAd: AzureAdConfig;
  appInsights: AppInsightsConfig;
  database: DatabaseConfig;
}

export interface AzureAdConfig {
  clientId: string;
  tenantId: string;
  tenant: string;
  audiences: string[];
  issuers: string[];
}

export interface AppInsightsConfig {
  instrumentationKey: string;
  logLevel: SeverityLevel;
}

export interface DatabaseConfig {}
