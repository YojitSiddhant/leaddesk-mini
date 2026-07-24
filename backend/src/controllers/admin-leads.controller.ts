import type { Request, Response } from "express";
import { ZodError } from "zod";

import { listAdminLeads } from "@/services/admin-leads.service";
import { adminLeadsQuerySchema, toAdminLeadsQuery } from "@/validators/admin-leads.validator";
import type {
  AdminLeadErrorResponse,
  AdminLeadListResponse,
} from "@/types/admin-lead";

export const getAdminLeadsController = async (
  req: Request,
  res: Response<AdminLeadListResponse | AdminLeadErrorResponse>,
) => {
  try {
    const parsedQuery = adminLeadsQuerySchema.parse(req.query);
    const data = await listAdminLeads(toAdminLeadsQuery(parsedQuery));

    return res.status(200).json({
      success: true,
      message: "Leads retrieved successfully.",
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

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve leads.",
      error: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
