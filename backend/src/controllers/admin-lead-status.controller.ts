import type { Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "@/errors/app-error";
import { changeAdminLeadStatus } from "@/services/admin-lead-status.service";
import {
  adminLeadStatusBodySchema,
  adminLeadStatusParamsSchema,
} from "@/validators/admin-lead-status.validator";
import type {
  AdminLeadErrorResponse,
  AdminLeadStatusUpdateResponse,
} from "@/types/admin-lead";

export const updateAdminLeadStatusController = async (
  req: Request,
  res: Response<AdminLeadStatusUpdateResponse | AdminLeadErrorResponse>,
) => {
  try {
    const parsedParams = adminLeadStatusParamsSchema.parse(req.params);
    const parsedBody = adminLeadStatusBodySchema.parse(req.body);

    const data = await changeAdminLeadStatus({
      id: parsedParams.id,
      status: parsedBody.status,
    });

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully.",
      data,
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
      });
    }

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: {
          code: error.code,
          details: error.details,
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update lead status.",
      error: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
