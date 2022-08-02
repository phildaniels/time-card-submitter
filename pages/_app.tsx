import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { msalInstance } from '../services/msal';
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { useMsalAuthentication } from '@azure/msal-react';
import { useEffect, useRef, useState } from 'react';
import {
  InteractionRequiredAuthError,
  InteractionType,
} from '@azure/msal-browser';
import { AppShell, useMantineTheme } from '@mantine/core';
import { AppNavbar } from '../components/app-nav-bar';
import { AppAside } from '../components/app-aside';
import { AppFooter } from '../components/app-footer';
import { AppHeader } from '../components/app-header';
import { axios } from '../services/http';

export default function App(props: AppProps & { userProfileUrl: string }) {
  const { Component, pageProps } = props;
  const request = {
    scopes: [`user.read ${process.env['NEXT_PUBLIC_AZURE_AD_API_SCOPE']}`],
  };
  const { login, error } = useMsalAuthentication(
    InteractionType.Silent,
    request
  );
  useEffect(() => {
    if (error instanceof InteractionRequiredAuthError) {
      login(InteractionType.Redirect, request);
    }
  }, [error]);
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const firstRender = useRef(true);
  const [userProfileUrl, setUserProfileUrl] = useState<string>();
  useEffect(() => {
    theme.colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const getAndSetUserProfileUrl = async () => {
      try {
        if (!firstRender.current) {
          return;
        }
        firstRender.current = false;
        const response = await axios.get<Blob>(
          'https://graph.microsoft.com/v1.0/me/photo/$value',
          {
            responseType: 'blob',
          }
        );
        setUserProfileUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    getAndSetUserProfileUrl();
  }, []);

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MsalProvider instance={msalInstance}>
        <AuthenticatedTemplate>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme: theme.colorScheme,
            }}
          >
            <AppShell
              styles={{
                main: {
                  background:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[8]
                      : theme.colors.gray[0],
                },
              }}
              navbarOffsetBreakpoint="sm"
              asideOffsetBreakpoint="sm"
              fixed
              navbar={<AppNavbar opened={opened}></AppNavbar>}
              aside={<AppAside></AppAside>}
              footer={<AppFooter></AppFooter>}
              header={
                <AppHeader
                  opened={opened}
                  theme={theme}
                  setOpened={setOpened}
                  userProfileUrl={userProfileUrl ?? null}
                ></AppHeader>
              }
            >
              <Component {...pageProps} />
            </AppShell>
          </MantineProvider>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate></UnauthenticatedTemplate>
      </MsalProvider>
    </>
  );
}
