"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeFavorite } from "@/app/components/OpportunityActions";

type RemoveFavoriteButtonProps = {
  opportunityId: string;
  opportunityType: "position" | "grant";
};

export function RemoveFavoriteButton({ opportunityId, opportunityType }: RemoveFavoriteButtonProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  async function remove() {
    setIsRemoving(true);
    removeFavorite(opportunityType, opportunityId);

    await fetch("/api/saved-opportunities", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ opportunityId, opportunityType })
    }).catch(() => undefined);

    setIsRemoving(false);
    router.refresh();
  }

  return (
    <button className="button secondary" disabled={isRemoving} onClick={remove} type="button">
      <Trash2 size={16} />
      {isRemoving ? "Rimuovo..." : "Rimuovi"}
    </button>
  );
}
