import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class MyLogger extends ConsoleLogger {
  error(message: any, error: unknown, context?: string) {
    const err = error instanceof Error ? error : new Error(String(error));
    super.error(message, err, context);
  }
}
