import { Router } from "express";

import { adminRouter } from "@/routes/admin.routes";
import { healthRouter } from "@/routes/health.routes";
import { leadsRouter } from "@/routes/leads.routes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/leads", leadsRouter);
apiRouter.use("/admin", adminRouter);

export { apiRouter };
