import { msalGraphInstance, msalTempusInstance } from './msal-server';
import axiosLibrary, { AxiosRequestConfig } from 'axios';
import { ConfidentialClientApplication } from '@azure/msal-node';

const axios = axiosLibrary.create();

axios.interceptors.request.use(async (request) => {
  const timeEntryBaseUrl =
    process.env.TEMPUS_BASE_API_URL ??
    'https://uliodev.azure-api.net/tempus-uat/api';
  if (request.url?.includes('https://graph.microsoft.com')) {
    const accessToken = await getTokenForScopes(msalGraphInstance, [
      process.env.GRAPH_API_SCOPE ?? '',
    ]);
    if (!request.headers) {
      request.headers = {};
    }
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  } else if (request.url?.includes(timeEntryBaseUrl)) {
    const accessToken = await getTokenForScopes(msalTempusInstance, [
      process.env.TEMPUS_DEFAULT_SCOPE ?? '',
    ]);
    if (!request.headers) {
      request.headers = {};
    }
    request.headers['Authorization'] = `Bearer ${accessToken}`;
    request.headers['Ocp-Apim-Subscription-Key'] =
      process.env.TEMPUS_SUBSCRIPTION_KEY ?? '';
  }
  return request;
});

export const getTokenForScopes = async (
  msalInstance: ConfidentialClientApplication,
  scopes: string[]
): Promise<string> => {
  try {
    const token = await msalInstance.acquireTokenByClientCredential({ scopes });
    return token?.accessToken ?? '';
  } catch (e) {
    throw e;
  }
};

export { axios };
