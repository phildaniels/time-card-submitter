import {
  Navbar,
  ThemeIcon,
  UnstyledButton,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import Link from 'next/link';

import { Group } from '@mantine/core';
import { IconHome, IconSettings } from '@tabler/icons';

type AppNavBarProps = {
  opened: boolean;
  userId: string | undefined | null;
};

export const AppNavbar = ({ opened, userId }: AppNavBarProps): JSX.Element => {
  const data = userId
    ? [
        {
          icon: <IconHome size={24} />,
          color: 'blue',
          label: 'Home',
          href: '/',
        },
        {
          icon: <IconSettings size={24} />,
          color: 'teal',
          label: 'Configure',
          href: `/configure/${userId}`,
        },
        // { icon: <IconMessages size={16} />, color: 'violet', label: 'Discussions' },
        // { icon: <IconDatabase size={16} />, color: 'grape', label: 'Databases' },
      ]
    : [
        {
          icon: <IconHome size={24} />,
          color: 'blue',
          label: 'Home',
          href: '/',
        },
      ];
  const { colorScheme } = useMantineColorScheme();
  if (!opened) {
    return <></>;
  }
  return (
    <Navbar
      p="md"
      hidden={!opened}
      width={
        opened
          ? {
              sm: 300,
              lg: 400,
              base: 0,
            }
          : {
              sm: 0,
              lg: 0,
              base: 0,
            }
      }
      fixed={false}
    >
      {data.map((link) => (
        <Link href={link.href} key={link.label}>
          <UnstyledButton
            sx={(theme) => ({
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color:
                colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

              '&:hover': {
                backgroundColor:
                  colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Group>
              <ThemeIcon color={link.color} variant="light" size={50}>
                {link.icon}
              </ThemeIcon>
              <Text size="lg">{link.label}</Text>
            </Group>
          </UnstyledButton>
        </Link>
      ))}
    </Navbar>
  );
};
