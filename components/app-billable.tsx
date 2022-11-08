import { Aside, MediaQuery, Text } from '@mantine/core';
import { Billable } from '../models/timecard';

type AppBillableProps = {
  billable: Billable[];
};

export const AppBillable = ({ billable }: AppBillableProps): JSX.Element => {
  return (
    <>
      {billable.map((bill) => (
        <div
          key={`${bill.labWareProjectId}_${bill.projectId}_${bill.oracleProjectNumber}`}
        >
          {bill.orderLines.map((orderLine) => (
            <div key={orderLine.orderLineNumber}>
              {[
                'sunday',
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
              ].map((dayOfTheWeek) => (
                <input key={`${dayOfTheWeek}_${orderLine.orderLineNumber}`} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
