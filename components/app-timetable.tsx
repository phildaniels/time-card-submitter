import { Aside, MediaQuery, Text } from '@mantine/core';
import { TempusWeekRangeHoursResponse } from '../models/timecard';
import { AppBillable } from './app-billable';

type AppTimeTableProps = {
  timeCard: TempusWeekRangeHoursResponse;
};

export const AppTimeTable = ({ timeCard }: AppTimeTableProps): JSX.Element => {
  return <AppBillable billable={timeCard.billable} />;
};
