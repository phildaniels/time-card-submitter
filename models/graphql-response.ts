export interface GraphQLResponse<T> {
  data?: T;
  error?: GraphQLError;
}

export interface Exception {
  stacktrace: string[];
}

export interface Extensions {
  code: string;
  exception: Exception;
}

export interface GraphQLInnerError {
  message: string;
  extensions: Extensions;
}

export interface GraphQLError {
  errors: GraphQLInnerError[];
}
