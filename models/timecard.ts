export interface HourSummaryWeekRangeValue {
  weekStart: Date;
  weekEnd: Date;
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  ulid: string;
  lastUpdated: Date;
  submissionStatusID: number;
  submissionStatus: string;
}

export interface HourSummaryWeekRangeResponse {
  count: number;
  value: HourSummaryWeekRangeValue[];
}

export interface WeeklyDayHour {
  otlHours: number;
  otlDate: Date;
  hoursTypeId?: number;
  laborTypeId?: number;
  hourTypeName: string;
  lastUpdated: Date;
}

export interface OracleTask {
  oracleTaskNumber: string;
  oracleTaskName: string;
  oracleChildTaskNumber?: string;
  oracleChildTaskName?: string;
  labwareProjectId?: string;
  labwareProjectName?: string;
  startDate: Date;
  endDate: Date;
  weeklyDayHours: WeeklyDayHour[];
}

export interface NonBillable {
  oracleProjectNumber: string;
  oracleProjectName: string;
  startDate: Date;
  endDate: Date;
  labWareProjectId?: string;
  labWareProjectName?: string;
  customerName: string;
  lastUpdated: Date;
  oracleTasks: OracleTask[];
}

export class TempusWeekRangeHoursResponse {
  constructor(
    public ulid: string,
    public employeeName: string,
    public email: string,
    public billable: Billable[],
    public nonBillable: NonBillable[],
    public nonWorkingHour: NonWorkingHour[]
  ) {}

  static Empty(ulid: string): TempusWeekRangeHoursResponse {
    return {
      ulid,
      employeeName: '',
      email: '',
      billable: [],
      nonBillable: [],
      nonWorkingHour: [],
    };
  }
}

export interface NonWorkingHour {
  weeklyDayHours: WeeklyDayHour[];
  lastUpdated: Date;
}

export interface Billable {
  projectId: string;
  flexProjectName: string;
  oracleProjectNumber: string;
  projectName: string;
  startDate?: Date;
  endDate?: Date;
  labWareProjectId: string;
  labWareProjectName: string;
  customerName: string;
  lastUpdated: Date;
  orderLines: OrderLine[];
}

export interface OrderLine {
  orderLineNumber: string;
  orderLineName: string;
  orderChildLineNumber: string;
  orderChildLineName: string;
  isParentChargeable: string;
  startDate: Date;
  endDate: Date;
  orderLineList: OrderlineDetail[];
  tasks: Task[];
}

export interface Task {
  flexTaskId: string;
  flexTaskName: string;
  revenuePhaseId: number;
  labwareProjectId: string;
  labwareProjectName: string;
  weeklyDayHours: WeeklyDayHour[];
}

export interface OrderlineDetail {
  orderLineNumber: string;
  orderLineName: string;
  isChargeable: boolean;
  isParent: boolean;
  startDate: Date;
  endDate: Date;
}
