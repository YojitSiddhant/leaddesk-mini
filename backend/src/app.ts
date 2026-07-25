import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "@/config/env";
import { errorHandler } from "@/middlewares/error-handler.middleware";
import { notFoundHandler } from "@/middlewares/not-found.middleware";
import { requestLogger } from "@/middlewares/request-logger.middleware";
import { apiRouter } from "@/routes/api.routes";

export const createApp = () => {
  const app = express();
  const corsOrigin =
    env.NODE_ENV === "development" ? "http://localhost:3000" : env.FRONTEND_URL;

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: corsOrigin,
      methods: ["GET", "POST", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(requestLogger);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
