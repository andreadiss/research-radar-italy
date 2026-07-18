"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { removeFavorite } from "@/app/components/OpportunityActions";

type RemoveFavoriteButtonProps = {
  opportunityId: string;
  opportunityType: "position" | "grant";
};

export function RemoveFavoriteButton({ opportunityId, opportunityType }: RemoveFavoriteButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  function remove() {
    setIsRemoving(true);
    removeFavorite(opportunityType, opportunityId);
    setIsRemoving(false);
  }

  return (
    <button className="button secondary" disabled={isRemoving} onClick={remove} type="button">
      <Trash2 size={16} />
      {isRemoving ? "Rimuovo..." : "Rimuovi"}
    </button>
  );
}
