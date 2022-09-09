import { EventType, InteractionType } from '@azure/msal-browser';
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { Text } from '@mantine/core';
import { useEffect, useState } from 'react';

export const Unauthorized = (): JSX.Element => {
  const { login, error } = useMsalAuthentication(InteractionType.Redirect, {
    scopes: [
      'profile',
      `${process.env['NEXT_PUBLIC_AZURE_AD_SPACE_DELIMITED_SCOPES']}`,
    ],
  });
  const { instance } = useMsal();
  const [message, setMessage] = useState(
    'Not logged in, redirecting to login...'
  );

  useEffect(() => {
    const callbackId = instance.addEventCallback(
      (message: { eventType: EventType }) => {
        if (message.eventType === EventType.LOGIN_SUCCESS) {
          setMessage(
            'Login successful! You will be taken to the home page momentarily...'
          );
          window?.location?.reload();
          return;
        }
        if (message.eventType === EventType.LOGOUT_START) {
          setMessage('Logging out...');
        }
      }
    );
    if (error) {
      login(InteractionType.Redirect, {
        scopes: [
          ...(process.env['NEXT_PUBLIC_AZURE_AD_API_SCOPE']
            ?.split(' ')
            ?.map((scope) => scope?.trim()) ?? []),
        ],
      });
      return;
    }
    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  });

  return <Text>{message}</Text>;
};
