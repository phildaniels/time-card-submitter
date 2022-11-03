import { msalInstance } from './msal-server';
import axiosLibrary, { AxiosRequestConfig } from 'axios';

const axios = axiosLibrary.create();

axios.interceptors.request.use(async (request) => {
  if (request.url?.includes('https://graph.microsoft.com')) {
    const accessToken = await getGraphToken([
      process.env.GRAPH_API_SCOPE ?? '',
    ]);
    if (!request.headers) {
      request.headers = {};
    }
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
});

export const getGraphToken = async (scopes: string[]): Promise<string> => {
  try {
    const token = await msalInstance.acquireTokenByClientCredential({ scopes });
    return token?.accessToken ?? '';
  } catch (e) {
    throw e;
  }
};

export { axios };
