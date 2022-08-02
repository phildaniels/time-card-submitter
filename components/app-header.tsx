import {
  Avatar,
  Burger,
  Header,
  MantineTheme,
  MediaQuery,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

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
  console.log(`🚀 ~ file: app-header.tsx ~ line 26 ~ theme`, theme);

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
        <Image
          src={
            theme.colorScheme === 'dark'
              ? '/UL-Solutions--white.svg'
              : '/UL-Solutions--no-fill.svg'
          }
          alt="UL Solutions Logo"
          width={100}
          height={100}
        />
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
