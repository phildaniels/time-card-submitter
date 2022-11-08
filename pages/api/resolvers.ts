import { TempusWeekRangeHoursResponse } from '../../models/timecard';
import { axios } from '../../utils/http-server';
import { GraphQLScalarType, Kind } from 'graphql';
import { start } from 'repl';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize: (value: Date) =>
    value == null ? null : new Date(value)?.toISOString(),
  parseValue: (value: any) => new Date(value),
  parseLiteral: (ast: { kind: Kind; value: string }) => {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
} as any);

export const resolvers = {
  Date: dateScalar,
  Query: {
    getTimeCard: async (_: any, args: { ulid: string; weekStart: Date }) => {
      const timeEntryBaseUrl = process.env.TEMPUS_BASE_API_URL;
      try {
        const startDate = new Date(args.weekStart);
        const endDate = new Date(args.weekStart);
        endDate.setDate(endDate.getDate() + 6);
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];
        const tempusWeekRangeHoursResponse = await axios.get<
          TempusWeekRangeHoursResponse | string
        >(
          `${timeEntryBaseUrl}/v1/TempusWeekRangeHours?ULID=${args.ulid}&StartDate=${startDateString}&EndDate=${endDateString}`
        );
        debugger;
        const tempusWeekRangeHours = tempusWeekRangeHoursResponse.data;
        if (tempusWeekRangeHours === '') {
          return null;
        }
        return tempusWeekRangeHours;
      } catch (e) {
        throw e;
      }
    },
  },
};
