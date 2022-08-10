import { Aside, MediaQuery, Text } from '@mantine/core';

type AppAsideProps = {
  opened: boolean;
};

export const AppAside = ({ opened }: AppAsideProps): JSX.Element => {
  if (!opened) {
    return <></>;
  }
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
