import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as appInsights from 'applicationinsights';
import { TelemetryClient } from 'applicationinsights';
import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import { AppInsightsConfig, Config } from '../configuration/config.model';

@Injectable()
export class AppInsightsService {
  private readonly appInsightsClient: TelemetryClient;
  private readonly logLevel: SeverityLevel;
  constructor(private configService: ConfigService<Config>) {
    const appInsightsConfig =
      this.configService.get<AppInsightsConfig>('appInsights');
    const instrumentationKey = appInsightsConfig?.instrumentationKey;
    this.logLevel = appInsightsConfig?.logLevel || SeverityLevel.Verbose;
    appInsights.setup(instrumentationKey).start();
    this.appInsightsClient = appInsights.defaultClient;
  }

  logPageView(
    name: string,
    url?: string,
    duration?: number,
    measurements?: { [key: string]: number }
  ): void {
    this.appInsightsClient.trackPageView({ name, url, duration, measurements });
  }

  logEvent(name: string, measurements?: { [key: string]: number }): void {
    this.appInsightsClient.trackEvent({ name, measurements });
  }

  logMetric(
    name: string,
    value: number,
    kind?: string,
    count?: number,
    min?: number,
    max?: number,
    stdDev?: number
  ): void {
    this.appInsightsClient.trackMetric({
      name,
      value,
      kind,
      count,
      min,
      max,
      stdDev,
    });
  }

  logException(
    exception: Error,
    severity?: SeverityLevel,
    measurements?: { [key: string]: number }
  ): void {
    if (severity && !(severity >= this.logLevel)) {
      return;
    }
    this.appInsightsClient.trackException({
      exception,
      severity,
      measurements,
    });
  }

  logTrace(message: string, severity?: SeverityLevel): void {
    if (severity && !(severity >= this.logLevel)) {
      return;
    }
    this.appInsightsClient.trackTrace({ message, severity });
  }
}
