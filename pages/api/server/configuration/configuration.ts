import { Config } from './config.model';

export default async () => {
  const config = {
    azureAd: {
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
      tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
      tenant: 'ul',
      issuers: [
        `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/v2.0`,
      ],
      audiences: [
        process.env.TEMPUS_AZURE_AD_CLIENT_ID,
        `api://${process.env.TEMPUS_AZURE_AD_CLIENT_ID}/.default`,
      ],
    },
    appInsights: {
      instrumentationKey: process.env.APP_INSIGHTS_INSTRUMENTATION_KEY,
      logLevel: 1,
    },
    database: {},
  } as Config;
  return config;
};
