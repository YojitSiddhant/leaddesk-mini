import { Router } from "express";

import { createLeadController } from "@/controllers/lead.controller";
import { publicLeadSubmissionRateLimit } from "@/middlewares/rate-limit.middleware";

const leadsRouter = Router();

leadsRouter.post("/", publicLeadSubmissionRateLimit, createLeadController);

export { leadsRouter };
