import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.GRAPH_API_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,
    clientSecret: process.env.GRAPH_API_CLIENT_SECRET,
  },
};

const msalInstance = new ConfidentialClientApplication(msalConfig);

export { msalInstance };
