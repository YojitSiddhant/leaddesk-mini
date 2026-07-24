import { Router } from "express";

import { getAdminLeadsController } from "@/controllers/admin-leads.controller";
import { updateAdminLeadStatusController } from "@/controllers/admin-lead-status.controller";

const adminLeadsRouter = Router();

adminLeadsRouter.get("/", getAdminLeadsController);
adminLeadsRouter.patch("/:id/status", updateAdminLeadStatusController);

export { adminLeadsRouter };
