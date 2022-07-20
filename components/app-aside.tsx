import { Aside, MediaQuery, Text } from '@mantine/core';

export const AppAside = (): JSX.Element => {
  return (
    <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
      <Aside
        p="md"
        hiddenBreakpoint="sm"
        width={{
          sm: 300,
          lg: 400,
          base: 100,
        }}
      >
        <Text>Application sidebar</Text>
      </Aside>
    </MediaQuery>
  );
};
