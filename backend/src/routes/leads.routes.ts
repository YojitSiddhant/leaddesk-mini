import { Router } from "express";

import { createLeadController } from "@/controllers/lead.controller";
import { publicLeadSubmissionRateLimit } from "@/middlewares/rate-limit.middleware";

const leadsRouter = Router();

leadsRouter.use((req, _res, next) => {
  if (req.method === "POST" && req.path === "/") {
    console.log("Reached leads router");
  }

  next();
});

leadsRouter.post("/", publicLeadSubmissionRateLimit, createLeadController);

export { leadsRouter };
