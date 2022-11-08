import {
  Button,
  Card,
  Checkbox,
  Group,
  Radio,
  Step,
  Stepper,
  Text,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { AppConfigureStepperStepTwo } from '../../components/app-configure-stepper-step-two';
import { axios as axiosServer } from '../../utils/http-server';
import { axios as axiosClient } from '../../services/http';
import {
  HourSummaryWeekRangeResponse,
  TempusWeekRangeHoursResponse,
} from '../../models/timecard';
import { GraphQLResponse } from '../../models/graphql-response';

const Configure: NextPage<{
  lastTimeCard: TempusWeekRangeHoursResponse | null;
  ulId: string;
}> = ({ lastTimeCard, ulId }) => {
  const getLastSunday = (date: Date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - newDate.getDay());
    return newDate;
  };

  const getNextSaturday = (date: Date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - newDate.getDay() + 6);
    return newDate;
  };

  const [active, setActive] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [radioValue, setRadioValue] = useState(StepOneRadioSelection.Blank);
  const [secondStepTimeCard, setSecondStepTimeCard] =
    useState<TempusWeekRangeHoursResponse | null>(null);

  const [datePickerValue, setDatePickerValue] = useState<Date | null>(
    getLastSunday(new Date())
  );
  const setRadioValueWithSideAffect = (selection: StepOneRadioSelection) => {
    switch (selection) {
      case StepOneRadioSelection.Blank:
        setSecondStepTimeCard(null);
        break;
      case StepOneRadioSelection.MostRecent:
        setSecondStepTimeCard(lastTimeCard);
        break;
      case StepOneRadioSelection.ParticularDate:
        break;
      default:
        break;
    }
    setRadioValue(selection);
  };

  const blankTimeCard: TempusWeekRangeHoursResponse = {
    ulid: ulId,
    employeeName: '',
    email: '',
    billable: [],
    nonBillable: [],
    nonWorkingHour: [],
  };

  useEffect(() => {
    if (radioValue === StepOneRadioSelection.ParticularDate) {
      axiosClient
        .post<GraphQLResponse<{ getTimeCard: TempusWeekRangeHoursResponse }>>(
          '/api/graphql',
          {
            query: `
						query($ulid: String!, $weekStart: Date!) {
							getTimeCard(ulid: $ulid, weekStart: $weekStart) {
								ulid
								employeeName
								email
								billable {
									projectId
									flexProjectName
									oracleProjectNumber
									projectName
									startDate
									endDate
									labWareProjectId
									labWareProjectName
									customerName
									lastUpdated
									orderLines {
										orderLineNumber
										orderLineName
										orderChildLineNumber
										orderChildLineName
										isParentChargeable
										startDate
										endDate
										orderLineList {
											orderLineNumber
											orderLineName
											isChargeable
											isParent
											startDate
											endDate
										}
										tasks {
											flexTaskId
											flexTaskName
											revenuePhaseId
											labwareProjectId
											labwareProjectName
											weeklyDayHours {
												otlHours
												otlDate
												hoursTypeId
												laborTypeId
												hourTypeName
												lastUpdated
											}
										}
									}
								}
								nonBillable {
									oracleProjectNumber
									oracleProjectName
									startDate
									endDate
									labWareProjectId
									labWareProjectName
									customerName
									lastUpdated
									oracleTasks {
										oracleTaskNumber
										oracleTaskName
										oracleChildTaskNumber
										oracleChildTaskName
										labwareProjectId
										labwareProjectName
										startDate
										endDate
										weeklyDayHours {
											otlHours
											otlDate
											hoursTypeId
											laborTypeId
											hourTypeName
											lastUpdated
										}
									}
								}
								nonWorkingHour {
									weeklyDayHours {
										otlHours
										otlDate
										hoursTypeId
										laborTypeId
										hourTypeName
										lastUpdated
									}
									lastUpdated
								}
							}
						}
					`,
            variables: {
              ulid: ulId,
              weekStart: new Date(datePickerValue ?? new Date())
                .toISOString()
                .split('T')[0],
            },
          }
        )
        .then((timeCardResponse) =>
          setSecondStepTimeCard(
            timeCardResponse?.data?.data?.getTimeCard ?? null
          )
        )
        .catch((err) => console.error(err));
    }
  }, [datePickerValue]);
  const nextStep = () =>
    setActive((current: number) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current: number) => (current > 0 ? current - 1 : current));
  return (
    <>
      <Card style={{ overflow: 'visible' }}>
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step label="Step 1" description="Select an option">
            <Radio.Group
              value={radioValue}
              onChange={(value) =>
                setRadioValueWithSideAffect(
                  stepOneRadioSelectionConverter(value)
                )
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
            {radioValue === StepOneRadioSelection.ParticularDate ? (
              <DatePicker
                label="Pick a week to start with"
                placeholder="Pick a start week"
                value={datePickerValue}
                onChange={setDatePickerValue}
                firstDayOfWeek="sunday"
                excludeDate={(date) => date.getDay() !== 0}
                dayStyle={(date: Date) =>
                  date.getDay() === 0 ? { color: 'black' } : {}
                }
              />
            ) : (
              <></>
            )}
          </Stepper.Step>
          <Stepper.Step
            label="Step 2"
            description="Edit your default timecard submittal"
          >
            <AppConfigureStepperStepTwo
              radioSelection={radioValue}
              timeCard={
                secondStepTimeCard ?? TempusWeekRangeHoursResponse.Empty(ulId)
              }
            />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(
    `🚀 ~ file: [userId].tsx ~ line 182 ~ constgetServerSideProps:GetServerSideProps= ~ context.cookies`,
    context.req.cookies
  );
  const userId = Array.isArray(context?.params?.userId)
    ? context?.params?.userId[0]?.split('@')[0]
    : (context?.params?.userId as string)?.split('@')[0];
  if (userId == null) {
    return {
      props: {
        lastTimeCard: null,
      },
    };
  }
  const timeEntryBaseUrl = process.env.TEMPUS_BASE_API_URL;
  try {
    const hourSummaryWeekRangeResponse =
      await axiosServer.post<HourSummaryWeekRangeResponse>(
        `${timeEntryBaseUrl}/v1/HourSummaryWeekRange`,
        { ulId: userId, sortType: 2, sortValue: 2, limit: 5, skip: 0 }
      );

    if ((hourSummaryWeekRangeResponse?.data?.value?.length ?? 0) === 0) {
      return {
        props: {
          lastTimeCard: null,
          ulId: userId,
        },
      };
    }
    const latestTimeCard = hourSummaryWeekRangeResponse?.data?.value[0];
    const tempusWeekRangeHoursResponse =
      await axiosServer.get<TempusWeekRangeHoursResponse>(
        `${timeEntryBaseUrl}/v1/TempusWeekRangeHours?ULID=${userId}&StartDate=${latestTimeCard.weekStart}&EndDate=${latestTimeCard.weekEnd}`
      );
    const tempusWeekRangeHours = tempusWeekRangeHoursResponse.data;
    return {
      props: {
        lastTimeCard: tempusWeekRangeHours,
        ulId: userId,
      },
    };
  } catch (e) {
    return {
      props: {
        lastTimeCard: null,
        ulId: userId,
      },
    };
  }
};

export default Configure;
