import { Card, Group, Text, Badge, Button, Center } from '@mantine/core';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage<{ isBeta: boolean }> = (props) => {
  return (
    <main>
      <Center>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Time Card Submittal Tool</Text>
            {props.isBeta ? (
              <Badge color="pink" variant="light">
                Beta
              </Badge>
            ) : null}
          </Group>

          <Text size="sm" color="dimmed">
            This tool can be configured to automatically submit your timecard,
            if it has not been submitted by end of day friday. Click the below
            link to begin
          </Text>

          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            <Link href="/configure">Click here to configure</Link>
          </Button>
        </Card>
      </Center>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    isBeta: process.env.NEXT_PUBLIC_IS_IN_BETA === 'true',
  },
});

export default Home;
