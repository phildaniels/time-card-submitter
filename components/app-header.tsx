import { useMsal } from '@azure/msal-react';
import {
  Avatar,
  Burger,
  Header,
  MantineTheme,
  MediaQuery,
  Text,
} from '@mantine/core';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { axios } from '../services/http';

type AppHeaderProps = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  theme: MantineTheme;
  userProfileUrl: string | null;
};

export const AppHeader = ({
  opened,
  setOpened,
  theme,
  userProfileUrl,
}: AppHeaderProps): JSX.Element => {
  return (
    <Header height={70} p="md">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Text>Application header</Text>
        <span className="spacer"></span>
        {userProfileUrl == null ? (
          <Avatar className="ul-avatar cursor-pointer" radius="xl" />
        ) : (
          <Avatar src={userProfileUrl} radius="xl" />
        )}
      </div>
    </Header>
  );
};
