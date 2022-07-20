import { AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';
import axios, { AxiosRequestConfig } from 'axios';
import { msalInstance } from './msal';

axios.interceptors.request.use(async (request) => {
  const redirectResponse = await msalInstance.handleRedirectPromise();
  const account = msalInstance.getAllAccounts()[0];
  if (redirectResponse !== null && request?.headers != null) {
    console.log(
      `🚀 ~ file: http.ts ~ line 9 ~ axios.interceptors.request.use ~ redirectResponse`,
      redirectResponse
    );
    let accessToken = redirectResponse.accessToken;
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    await enrichNewAccessTokenInAxiosRequest(
      account,
      // process.env['NEXT_PUBLIC_AZURE_AD_API_SCOPE']?.split(' ') ?? [],
      [],
      request
    );
  }
  return request;
});

const enrichNewAccessTokenInAxiosRequest = async (
  account: AccountInfo,
  scopes: string[],
  request: AxiosRequestConfig<any>
): Promise<void> => {
  let token = '';
  const accessTokenRequest = {
    scopes: [`user.read ${scopes.join(' ')}`.trim()],
    account: account,
  };
  try {
    const accessTokenResponse = await msalInstance.acquireTokenSilent(
      accessTokenRequest
    );
    let accessToken = accessTokenResponse.accessToken;
    if (request?.headers != null) {
      request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
  } catch (error) {
    console.log(error);
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({
        ...accessTokenRequest,
        redirectStartPage: '/',
      });
    }
  }
};

export { axios };