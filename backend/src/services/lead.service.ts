import type { CreateLeadDto } from "@/validators/lead.validator";

import { createLead } from "@/repositories/lead.repository";

export const submitLead = async (input: CreateLeadDto): Promise<number> => {
  const leadId = await createLead(input);
  return leadId;
};
