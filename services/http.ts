import { AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';
import axios, { AxiosRequestConfig } from 'axios';
import { msalInstance } from './msal';

axios.interceptors.request.use(async (request) => {
  // TODO try conditionally specifying scopes based off of the route
  const redirectResponse = await msalInstance.handleRedirectPromise();
  const account = msalInstance.getAllAccounts()[0];
  if (account == null) {
    const accessTokenRequest = {
      scopes: [
        'profile',
        ...(process.env['NEXT_PUBLIC_AZURE_AD_SPACE_DELIMITED_SCOPES']
          ?.split(' ')
          ?.map((scope) => scope?.trim()) ?? []),
      ],
    };
    await msalInstance.acquireTokenRedirect({
      ...accessTokenRequest,
      redirectStartPage: '/',
    });
  }
  if (redirectResponse !== null && request?.headers != null) {
    let accessToken = redirectResponse.accessToken;
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    await enrichNewAccessTokenInAxiosRequest(
      account,
      [
        'profile',
        ...(process.env['NEXT_PUBLIC_AZURE_AD_SPACE_DELIMITED_SCOPES']
          ?.split(' ')
          ?.map((scope) => scope?.trim()) ?? []),
      ],
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
  const accessTokenRequest = {
    scopes,
    account,
  };
  try {
    if (account == null) {
      throw new InteractionRequiredAuthError();
    }
    const accessTokenResponse = await msalInstance.acquireTokenSilent(
      accessTokenRequest
    );
    let accessToken = accessTokenResponse.accessToken;
    if (request?.headers != null) {
      request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
  } catch (error) {
    console.log(error);
    if (!error || error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({
        ...accessTokenRequest,
        redirectStartPage: '/',
      });
    }
  }
};

export { axios };
