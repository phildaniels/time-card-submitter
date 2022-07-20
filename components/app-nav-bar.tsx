import { Navbar } from '@mantine/core';

type AppNavBarProps = {
  opened: boolean;
};

export const AppNavbar = ({ opened }: AppNavBarProps): JSX.Element => {
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{
        sm: 300,
        lg: 400,
        base: 100,
      }}
    >
      <Navbar.Section>First section</Navbar.Section>

      {/* Grow section will take all available space that is not taken by first and last sections */}
      <Navbar.Section grow>Grow section</Navbar.Section>

      {/* Last section with normal height (depends on section content) */}
      <Navbar.Section>Last section</Navbar.Section>
    </Navbar>
  );
};
