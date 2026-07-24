import type { NextFunction, Request, Response } from "express";

import { ADMIN_SESSION_COOKIE_NAME } from "@/constants/admin-auth.constants";
import { AppError } from "@/errors/app-error";
import { getAdminUserFromSession } from "@/services/admin-auth.service";
import type { AdminSessionLocals } from "@/types/admin";
import { getAdminSessionClearCookieOptions } from "@/utils/cookie-options";

export const requireAdminAuth = async (
  req: Request,
  res: Response<unknown, AdminSessionLocals>,
  next: NextFunction,
) => {
  try {
    const sessionToken = req.cookies[ADMIN_SESSION_COOKIE_NAME];

    if (typeof sessionToken !== "string" || sessionToken.length === 0) {
      throw new AppError("Unauthorized.", 401, true, "UNAUTHORIZED");
    }

    const { adminUser } = await getAdminUserFromSession(sessionToken);
    res.locals.adminUser = adminUser;
    next();
  } catch {
    res.clearCookie(
      ADMIN_SESSION_COOKIE_NAME,
      getAdminSessionClearCookieOptions(),
    );

    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
      error: {
        code: "UNAUTHORIZED",
      },
    });
  }
};
