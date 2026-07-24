import type { Request, Response } from "express";
import { ZodError } from "zod";

import { ADMIN_SESSION_COOKIE_NAME } from "@/constants/admin-auth.constants";
import { AppError } from "@/errors/app-error";
import { loginAdminUser, logoutAdminSession } from "@/services/admin-auth.service";
import { adminLoginSchema } from "@/validators/admin.validator";
import { getAdminSessionClearCookieOptions, getAdminSessionCookieOptions } from "@/utils/cookie-options";
import type {
  AdminErrorResponse,
  AdminLoginRouteResponse,
  AdminMeResponse,
  AdminSessionLocals,
} from "@/types/admin";

export const loginAdminController = async (
  req: Request,
  res: Response<AdminLoginRouteResponse>,
) => {
  try {
    const parsedBody = adminLoginSchema.parse(req.body);
    const { adminUser, sessionToken } = await loginAdminUser(parsedBody);

    return res
      .cookie(
        ADMIN_SESSION_COOKIE_NAME,
        sessionToken,
        getAdminSessionCookieOptions(),
      )
      .status(200)
      .json({
        success: true,
        message: "Admin login successful.",
        data: adminUser,
      });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: {
          code: "VALIDATION_ERROR",
          details: error.flatten(),
        },
      } satisfies AdminErrorResponse);
    }

    if (error instanceof AppError && error.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: error.message,
        error: {
          code: error.code,
          details: error.details,
        },
      } satisfies AdminErrorResponse);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to log in.",
      error: {
        code: "INTERNAL_SERVER_ERROR",
      },
    } satisfies AdminErrorResponse);
  }
};

export const logoutAdminController = async (
  req: Request,
  res: Response,
) => {
  const sessionToken = req.cookies[ADMIN_SESSION_COOKIE_NAME];

  if (typeof sessionToken === "string" && sessionToken.length > 0) {
    await logoutAdminSession(sessionToken);
  }

  return res
    .clearCookie(
      ADMIN_SESSION_COOKIE_NAME,
      getAdminSessionClearCookieOptions(),
    )
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully.",
    });
};

export const getCurrentAdminController = async (
  _req: Request,
  res: Response<AdminMeResponse, AdminSessionLocals>,
) => {
  return res.status(200).json({
    success: true,
    message: "Admin session is active.",
    data: res.locals.adminUser,
  });
};
