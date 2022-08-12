import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { msalInstance } from '../services/msal';
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import Head from 'next/head';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { useMsalAuthentication } from '@azure/msal-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
    scopes: [`${process.env['NEXT_PUBLIC_AZURE_AD_API_SCOPE']}`],
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
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value ?? (colorScheme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('defaultTheme', newColorScheme);
    setColorScheme(newColorScheme);
  };
  const [navbarOpened, setNavbarOpened] = useState(false);
  const setNavbarOpenedWithLocalStorageSideAffect = (
    value: boolean | ((value: boolean) => boolean)
  ) => {
    localStorage.setItem('navbarOpenedByDefault', `${!navbarOpened}`);
    setNavbarOpened(value);
  };
  const [asideOpened, setAsideOpened] = useState(false);
  const setAsideOpenedWithLocalStorageSideAffect = (
    value: boolean | ((value: boolean) => boolean)
  ) => {
    localStorage.setItem('asideOpenedByDefault', `${!asideOpened}`);
    setAsideOpened(value);
  };
  const firstRender = useRef(true);
  const [userProfileUrl, setUserProfileUrl] = useState<string | null>(null);
  useEffect(() => {
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
  useEffect(() => {
    toggleColorScheme(
      (localStorage.getItem('defaultTheme') as ColorScheme) ?? 'light'
    );
    setNavbarOpened(localStorage.getItem('navbarOpenedByDefault') === 'true');
    setAsideOpened(localStorage.getItem('asideOpenedByDefault') === 'true');
  }, []);
  return (
    <>
      <Head>
        <title>Time Card Auto Submit Tool</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MsalProvider instance={msalInstance}>
        <AuthenticatedTemplate>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                colorScheme: colorScheme,
              }}
            >
              <AppShell
                styles={{
                  main: {
                    background:
                      colorScheme === 'dark'
                        ? theme.colors.dark[8]
                        : theme.colors.gray[0],
                  },
                }}
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                fixed
                navbar={<AppNavbar opened={navbarOpened}></AppNavbar>}
                aside={<AppAside opened={asideOpened}></AppAside>}
                footer={<AppFooter></AppFooter>}
                header={
                  <AppHeader
                    navbarOpened={navbarOpened}
                    asideOpened={asideOpened}
                    setNavbarOpen={setNavbarOpenedWithLocalStorageSideAffect}
                    setAsideOpen={setAsideOpenedWithLocalStorageSideAffect}
                    userProfileUrl={userProfileUrl}
                  ></AppHeader>
                }
              >
                <Component {...pageProps} />
              </AppShell>
            </MantineProvider>
          </ColorSchemeProvider>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate></UnauthenticatedTemplate>
      </MsalProvider>
    </>
  );
}
