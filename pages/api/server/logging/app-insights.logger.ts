import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import { AppInsightsService } from './app-insights.service';

@Injectable({ scope: Scope.TRANSIENT })
export class AppInsightsLogger extends ConsoleLogger {
  constructor(private appInsightsService: AppInsightsService) {
    super();
  }

  error(message: any, trace?: string, context?: string): void {
    this.appInsightsService.logTrace(
      JSON.stringify({ message, trace, context }),
      SeverityLevel.Error
    );
    super.error(message, trace, context);
  }

  log(message: any, context?: string): void {
    this.appInsightsService.logTrace(
      JSON.stringify({ message, context }),
      SeverityLevel.Information
    );
    super.log(message, context);
  }

  warn(message: any, context?: string): void {
    this.appInsightsService.logTrace(
      JSON.stringify({ message, context }),
      SeverityLevel.Warning
    );
    super.warn(message, context);
  }

  debug(message: any, context?: string): void {
    this.appInsightsService.logTrace(
      JSON.stringify({ message, context }),
      SeverityLevel.Verbose
    );
    super.debug(message, context);
  }

  verbose(message: any, context?: string): void {
    this.appInsightsService.logTrace(
      JSON.stringify({ message, context }),
      SeverityLevel.Verbose
    );
    super.verbose(message, context);
  }

  critical(message: any, context?: string): void {
    this.appInsightsService.logTrace(
      JSON.stringify({ message, context }),
      SeverityLevel.Critical
    );
    super.error(message, context);
  }

  exception(exception: Error, context?: string): void {
    this.appInsightsService.logException(exception, SeverityLevel.Error);
    super.error(JSON.stringify(exception), context);
  }
}
