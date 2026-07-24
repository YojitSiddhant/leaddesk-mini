import type { LeadFormValues, LeadSubmissionResponse } from "@/app/types/lead";
import { getApiBaseUrl } from "@/app/lib/api-config";

export const submitLead = async (
  payload: LeadFormValues,
): Promise<LeadSubmissionResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as LeadSubmissionResponse;
  return data;
};
