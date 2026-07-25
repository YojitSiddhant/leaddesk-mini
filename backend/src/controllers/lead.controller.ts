import type { Request, Response } from "express";
import { ZodError } from "zod";

import { env } from "@/config/env";
import { submitLead } from "@/services/lead.service";
import { createLeadSchema } from "@/validators/lead.validator";

const logLeadSubmissionError = (error: unknown) => {
  console.error("POST /api/leads failed");
  console.error(error);

  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
};

export const createLeadController = async (req: Request, res: Response) => {
  try {
    const parsedBody = createLeadSchema.parse(req.body);
    const leadId = await submitLead(parsedBody);

    return res.status(201).json({
      success: true,
      message: "Lead submitted successfully.",
      data: {
        id: leadId,
      },
    });
  } catch (error) {
    logLeadSubmissionError(error);

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
      message:
        env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "Failed to submit lead.",
      error: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
