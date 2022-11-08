import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  scalar Date

  type TimeCard {
    id: ID!
    login: String!
    avatar_url: String!
  }

  type Query {
    getTimeCard(ulid: String!, weekStart: Date!): TempusWeekRangeHours
  }

  type HourSummaryWeekRange {
    weekStart: Date!
    weekEnd: Date!
    totalHours: Float!
    billableHours: Float!
    nonBillableHours: Float!
    ulid: String!
    lastUpdated: Date!
    submissionStatusID: Float!
    submissionStatus: String!
  }

  type HourSummaryWeekRangeResponse {
    count: Int!
    value: [HourSummaryWeekRange]!
  }

  type WeeklyDayHour {
    otlHours: Float!
    otlDate: Date!
    hoursTypeId: Int
    laborTypeId: Int
    hourTypeName: String
    lastUpdated: Date!
  }

  type OracleTask {
    oracleTaskNumber: String!
    oracleTaskName: String!
    oracleChildTaskNumber: String
    oracleChildTaskName: String
    labwareProjectId: String
    labwareProjectName: String
    startDate: Date!
    endDate: Date!
    weeklyDayHours: [WeeklyDayHour]!
  }

  type NonBillable {
    oracleProjectNumber: String!
    oracleProjectName: String!
    startDate: Date!
    endDate: Date!
    labWareProjectId: String
    labWareProjectName: String
    customerName: String!
    lastUpdated: Date!
    oracleTasks: [OracleTask]!
  }

  type NonWorkingHour {
    weeklyDayHours: [WeeklyDayHour]!
    lastUpdated: Date!
  }

  type Billable {
    projectId: String
    flexProjectName: String
    oracleProjectNumber: String
    projectName: String
    startDate: Date
    endDate: Date
    labWareProjectId: String
    labWareProjectName: String
    customerName: String
    lastUpdated: Date!
    orderLines: [OrderLine]!
  }

  type OrderLine {
    orderLineNumber: String!
    orderLineName: String!
    orderChildLineNumber: String
    orderChildLineName: String
    isParentChargeable: String
    startDate: Date
    endDate: Date
    orderLineList: [OrderlineDetail]
    tasks: [Task]
  }

  type Task {
    flexTaskId: String
    flexTaskName: String
    revenuePhaseId: Int
    labwareProjectId: String
    labwareProjectName: String
    weeklyDayHours: [WeeklyDayHour]
  }

  type OrderlineDetail {
    orderLineNumber: String!
    orderLineName: String
    isChargeable: Boolean
    isParent: Boolean
    startDate: Date!
    endDate: Date
  }

  type TempusWeekRangeHours {
    ulid: String!
    employeeName: String!
    email: String!
    billable: [Billable]!
    nonBillable: [NonBillable]!
    nonWorkingHour: [NonWorkingHour]!
  }
`;
