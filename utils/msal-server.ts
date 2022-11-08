import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';

const msalGraphConfig: Configuration = {
  auth: {
    clientId: process.env.GRAPH_API_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,
    clientSecret: process.env.GRAPH_API_CLIENT_SECRET,
  },
};

const msalTempusConfig: Configuration = {
  auth: {
    clientId: process.env.TEMPUS_AZURE_AD_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,
    clientSecret: process.env.TEMPUS_AZURE_AD_CLIENT_SECRET,
  },
};

const msalGraphInstance = new ConfidentialClientApplication(msalGraphConfig);
const msalTempusInstance = new ConfidentialClientApplication(msalTempusConfig);

export { msalGraphInstance, msalTempusInstance };
