import generatedGrants from "@/lib/generated/grants.json";
import type { GrantOpportunity } from "@/lib/types";

export const grants = generatedGrants as GrantOpportunity[];

export function getGrantById(id: string) {
  return grants.find((grant) => grant.id === id);
}
