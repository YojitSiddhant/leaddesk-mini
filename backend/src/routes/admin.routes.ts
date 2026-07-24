import { Router } from "express";

import {
  getCurrentAdminController,
  loginAdminController,
  logoutAdminController,
} from "@/controllers/admin-auth.controller";
import { requireAdminAuth } from "@/middlewares/admin-auth.middleware";
import { adminLoginRateLimit } from "@/middlewares/rate-limit.middleware";
import { adminLeadsRouter } from "@/routes/admin-leads.routes";

const adminRouter = Router();

adminRouter.post("/login", adminLoginRateLimit, loginAdminController);
adminRouter.post("/logout", logoutAdminController);
adminRouter.get("/me", requireAdminAuth, getCurrentAdminController);
adminRouter.use("/leads", requireAdminAuth, adminLeadsRouter);

export { adminRouter };
