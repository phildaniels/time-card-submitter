import { Text } from '@mantine/core';
import { StepOneRadioSelection } from '../pages/configure';

type AppConfigureStepperStepTwoProps = {
  radioSelection: StepOneRadioSelection;
};

export const AppConfigureStepperStepTwo = ({
  radioSelection,
}: AppConfigureStepperStepTwoProps): JSX.Element => {
  switch (radioSelection) {
    case StepOneRadioSelection.Blank:
      return <Text>Blank</Text>;
    case StepOneRadioSelection.MostRecent:
      return <Text>Most Recent</Text>;
    case StepOneRadioSelection.ParticularDate:
      return <Text>Particular Date</Text>;
    default:
      return <Text>Blank</Text>;
  }
};
