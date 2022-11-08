import { Text } from '@mantine/core';
import { TempusWeekRangeHoursResponse } from '../models/timecard';
import { StepOneRadioSelection } from '../pages/configure/[userId]';
import { AppTimeTable } from './app-timetable';

type AppConfigureStepperStepTwoProps = {
  radioSelection: StepOneRadioSelection;
  timeCard: TempusWeekRangeHoursResponse;
};

export const AppConfigureStepperStepTwo = ({
  radioSelection,
  timeCard,
}: AppConfigureStepperStepTwoProps): JSX.Element => {
  return <AppTimeTable timeCard={timeCard} />;
};
