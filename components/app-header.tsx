import {
  ActionIcon,
  Avatar,
  Burger,
  Button,
  Header,
  Menu,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import Image from 'next/image';
import {
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
  IconLogout,
  IconMoonStars,
  IconSun,
} from '@tabler/icons';
import { useMsal } from '@azure/msal-react';

type AppHeaderProps = {
  navbarOpened: boolean;
  asideOpened: boolean;
  setNavbarOpen: (value: boolean | ((value: boolean) => boolean)) => void;
  setAsideOpen: (value: boolean | ((value: boolean) => boolean)) => void;
  userProfileUrl: string | null;
};

export const AppHeader = ({
  navbarOpened,
  asideOpened,
  setNavbarOpen,
  setAsideOpen,
  userProfileUrl,
}: AppHeaderProps): JSX.Element => {
  const { instance } = useMsal();
  const logout = () => instance.logoutRedirect();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  return (
    <Header height={70} p="md" style={{ backgroundColor: theme.colors.red[9] }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Burger
          opened={navbarOpened}
          onClick={() => setNavbarOpen((o) => !o)}
          size="sm"
          color="white"
          mr="xl"
        />
        <Image
          src="/UL-Solutions--white.svg"
          alt="UL Solutions Logo"
          width={100}
          height={100}
        />
        <span className="spacer"></span>
        <ActionIcon
          variant="default"
          onClick={() => toggleColorScheme()}
          size={50}
          className="navbar-action-button"
        >
          {colorScheme === 'dark' ? (
            <IconSun size={24} />
          ) : (
            <IconMoonStars size={24} />
          )}
        </ActionIcon>
        <ActionIcon
          variant="default"
          onClick={() => setAsideOpen((o) => !o)}
          size={50}
          className="navbar-action-button"
        >
          {asideOpened ? (
            <IconLayoutSidebarRightCollapse size={24} />
          ) : (
            <IconLayoutSidebarRightExpand size={24} />
          )}
        </ActionIcon>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton>
              {' '}
              {userProfileUrl == null ? (
                <Avatar size={50} className="ul-avatar" radius="xl" />
              ) : (
                <Avatar size={50} src={userProfileUrl} radius="xl" />
              )}
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item icon={<IconLogout size={14} />} onClick={() => logout()}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </Header>
  );
};
