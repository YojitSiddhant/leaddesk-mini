import pinoHttp from "pino-http";

import { logger } from "@/config/logger";

export const requestLogger = pinoHttp({
  logger,
  autoLogging: true,
  customProps: () => ({}),
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: (error) => {
      const loggedError = error as Error & { type?: string };

      return {
        type: loggedError.type,
        message: loggedError.message,
      };
    },
  },
});
