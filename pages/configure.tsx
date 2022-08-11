import {
  Button,
  Card,
  Checkbox,
  Group,
  Radio,
  Stepper,
  Text,
} from '@mantine/core';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { AppConfigureStepperStepTwo } from '../components/app-configure-stepper-step-two';
import { axios } from '../services/http';
const Configure: NextPage = () => {
  const [active, setActive] = useState(0);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [radioValue, setRadioValue] = useState(StepOneRadioSelection.Blank);
  useEffect(() => {
    axios
      .get<number>('/api/randomNumber')
      .then((response) => setRandomNumber(response.data))
      .catch((error) => console.error(error));
  }, []);
  const nextStep = () =>
    setActive((current: number) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current: number) => (current > 0 ? current - 1 : current));
  return (
    <>
      <Card>
        <Text>Random Number was {randomNumber}</Text>
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step label="Step 1" description="Select an option">
            <Radio.Group
              value={radioValue}
              onChange={(value) =>
                setRadioValue(stepOneRadioSelectionConverter(value))
              }
              label="Select a starting option"
              description="You can re-configure this again later"
              required
              size="md"
              orientation="vertical"
            >
              <Radio
                value={StepOneRadioSelection.Blank}
                label="Start with a blank timecard"
              />
              <Radio
                value={StepOneRadioSelection.MostRecent}
                label="Start with my most recent timecard"
              />
              <Radio
                value={StepOneRadioSelection.ParticularDate}
                label="Choose a particular date"
              />
            </Radio.Group>
          </Stepper.Step>
          <Stepper.Step
            label="Step 2"
            description="Edit your default timecard submittal"
          >
            <AppConfigureStepperStepTwo radioSelection={radioValue} />
          </Stepper.Step>
          <Stepper.Step label="Step 3" description="Confirm your timecard">
            <Text>Review your selection</Text>
          </Stepper.Step>
          <Stepper.Completed>
            <Text>
              I understand that this tool has the potential to submit an
              incorrect timecard and will use at my own risk, and that the
              creator(s) of this tool is not liable for such a scenario
            </Text>
            <Checkbox
              size="md"
              label="I agree to the above statement"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms((o) => !o)}
            />
          </Stepper.Completed>
        </Stepper>
        <Group position="center" mt="xl">
          <Button variant="default" disabled={active === 0} onClick={prevStep}>
            Back
          </Button>
          {active === 3 ? (
            <Button
              disabled={!agreeToTerms}
              onClick={() => console.log('Submitted')}
            >
              Submit
            </Button>
          ) : (
            <Button onClick={nextStep}>Next step</Button>
          )}
        </Group>
      </Card>
    </>
  );
};

export enum StepOneRadioSelection {
  Blank = 'Blank',
  MostRecent = 'MostRecent',
  ParticularDate = 'ParticularDate',
}

export const stepOneRadioSelectionConverter = (
  value: string
): StepOneRadioSelection => {
  switch (value) {
    case 'Blank':
      return StepOneRadioSelection.Blank;
    case 'MostRecent':
      return StepOneRadioSelection.MostRecent;
    case 'ParticularDate':
      return StepOneRadioSelection.ParticularDate;
    default:
      return StepOneRadioSelection.Blank;
  }
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   const randomNumberApiResponse = await axios.get<number>('/api/randomNumber');
//   const randomNumber = randomNumberApiResponse.data;
//   return {
//     props: {
//       randomNumber,
//     },
//   };
// };

export default Configure;
