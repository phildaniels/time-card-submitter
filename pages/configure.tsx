import { Button, Card, Group, Stepper } from '@mantine/core';
import type { GetStaticProps, NextPage } from 'next';
import { useState } from 'react';
const Configure: NextPage = () => {
  const [active, setActive] = useState(1);
  const [opened, setOpened] = useState(false);
  const nextStep = () =>
    setActive((current: number) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current: number) => (current > 0 ? current - 1 : current));
  return (
    <>
      <Card>
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step label="First step" description="Select an option">
            Step 1 content: Create an account
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Verify email">
            Step 2 content: Verify email
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Get full access">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group>
      </Card>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    isBeta: process.env.NEXT_PUBLIC_IS_IN_BETA === 'true',
  },
});

export default Configure;
