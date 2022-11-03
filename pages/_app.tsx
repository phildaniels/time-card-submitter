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
import { useEffect, useRef, useState } from 'react';
import { AppShell, useMantineTheme } from '@mantine/core';
import { AppNavbar } from '../components/app-nav-bar';
import { AppAside } from '../components/app-aside';
import { AppFooter } from '../components/app-footer';
import { AppHeader } from '../components/app-header';
import { axios } from '../services/http';
import { Unauthorized } from '../components/unauthorized';
import { EventType } from '@azure/msal-browser';

export default function App(props: AppProps & { userProfileUrl: string }) {
  const { Component, pageProps } = props;

  const accounts = msalInstance.getAllAccounts();
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [asideOpened, setAsideOpened] = useState(false);
  const [userProfileUrl, setUserProfileUrl] = useState<string | null>(null);
  const [navbarOpened, setNavbarOpened] = useState(false);

  const theme = useMantineTheme();

  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value ?? (colorScheme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('defaultTheme', newColorScheme);
    setColorScheme(newColorScheme);
  };
  const setNavbarOpenedWithLocalStorageSideEffect = (
    value: boolean | ((value: boolean) => boolean)
  ) => {
    localStorage.setItem('navbarOpenedByDefault', `${!navbarOpened}`);
    setNavbarOpened(value);
  };
  const setAsideOpenedWithLocalStorageSideEffect = (
    value: boolean | ((value: boolean) => boolean)
  ) => {
    localStorage.setItem('asideOpenedByDefault', `${!asideOpened}`);
    setAsideOpened(value);
  };

  useEffect(() => {
    if (!accounts || !accounts.length || !(accounts.length > 0)) {
      return;
    }
    toggleColorScheme(
      (localStorage.getItem('defaultTheme') as ColorScheme) ?? 'light'
    );
    setNavbarOpened(localStorage.getItem('navbarOpenedByDefault') === 'true');
    setAsideOpened(localStorage.getItem('asideOpenedByDefault') === 'true');
    const callbackId = msalInstance.addEventCallback((message) => {
      if (message.eventType === EventType.HANDLE_REDIRECT_END) {
        const account = accounts[0];
        if (!account?.username) {
          return;
        }
        axios
          .get(`/api/profile-photo/${account.username}`, {
            responseType: 'blob',
          })
          .then((response) =>
            setUserProfileUrl(URL.createObjectURL(response?.data))
          )
          .catch((error) => console.log(error));
      }
    });

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId);
      }
    };
  }, []);

  if (!accounts || !accounts.length || !(accounts.length > 0)) {
    return (
      <MsalProvider instance={msalInstance}>
        <Unauthorized></Unauthorized>
      </MsalProvider>
    );
  }

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
                    setNavbarOpen={setNavbarOpenedWithLocalStorageSideEffect}
                    setAsideOpen={setAsideOpenedWithLocalStorageSideEffect}
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
