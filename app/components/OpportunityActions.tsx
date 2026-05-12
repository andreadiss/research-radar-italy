"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

type OpportunityType = "position" | "grant";

type OpportunityActionsProps = {
  detailHref: string;
  opportunityId: string;
  opportunityType: OpportunityType;
  title: string;
};

export type Favorite = {
  detailHref: string;
  id: string;
  title: string;
  type: OpportunityType;
};

const favoritesKey = "rr_favorites";
const favoritesEvent = "rr:favorites-updated";

export function OpportunityActions({
  detailHref,
  opportunityId,
  opportunityType,
  title
}: OpportunityActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsSaved(readFavorites().some((favorite) => favorite.id === opportunityId && favorite.type === opportunityType));

    fetch("/api/auth/me")
      .then((response) => setIsAuthenticated(response.ok))
      .catch(() => setIsAuthenticated(false));
  }, [opportunityId, opportunityType]);

  async function saveOpportunity() {
    if (!isAuthenticated) {
      window.location.href = `/login?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      return;
    }

    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    writeFavorite({ detailHref, id: opportunityId, title, type: opportunityType }, nextSaved);

    await fetch("/api/saved-opportunities", {
      method: nextSaved ? "POST" : "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        opportunityId,
        opportunityType,
        title,
        status: "saved"
      })
    });
  }

  return (
    <div className="card-actions" aria-label="Azioni opportunità">
      <button
        aria-pressed={isSaved}
        className={isSaved ? "icon-action active" : "icon-action"}
        onClick={saveOpportunity}
        title={!isAuthenticated ? "Accedi per salvare" : isSaved ? "Salvata nei preferiti" : "Salva nei preferiti"}
        type="button"
      >
        <Bookmark size={17} />
      </button>
    </div>
  );
}

export function readFavorites() {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(favoritesKey) ?? "[]") as Favorite[];
  } catch {
    return [];
  }
}

function writeFavorite(favorite: Favorite, active: boolean) {
  const favorites = readFavorites().filter((item) => !(item.id === favorite.id && item.type === favorite.type));
  const nextFavorites = active ? [favorite, ...favorites] : favorites;
  window.localStorage.setItem(favoritesKey, JSON.stringify(nextFavorites));
  window.dispatchEvent(new Event(favoritesEvent));
}

export function removeFavorite(type: OpportunityType, id: string) {
  const favorites = readFavorites().filter((item) => !(item.id === id && item.type === type));
  window.localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  window.dispatchEvent(new Event(favoritesEvent));
}

export { favoritesEvent };
