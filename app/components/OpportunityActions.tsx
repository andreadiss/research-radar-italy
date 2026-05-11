"use client";

import { Bell, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

type OpportunityType = "position" | "grant";

type OpportunityActionsProps = {
  alertFilters: Record<string, string>;
  detailHref: string;
  opportunityId: string;
  opportunityType: OpportunityType;
  title: string;
};

type Favorite = {
  detailHref: string;
  id: string;
  title: string;
  type: OpportunityType;
};

const favoritesKey = "rr_favorites";
const alertsKey = "rr_alerted_opportunities";
const favoritesEvent = "rr:favorites-updated";

export function OpportunityActions({
  alertFilters,
  detailHref,
  opportunityId,
  opportunityType,
  title
}: OpportunityActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isAlerted, setIsAlerted] = useState(false);

  useEffect(() => {
    setIsSaved(readFavorites().some((favorite) => favorite.id === opportunityId && favorite.type === opportunityType));
    setIsAlerted(readIds(alertsKey).includes(actionKey(opportunityType, opportunityId)));
  }, [opportunityId, opportunityType]);

  async function saveOpportunity() {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    writeFavorite({ detailHref, id: opportunityId, title, type: opportunityType }, nextSaved);

    if (nextSaved) {
      await fetch("/api/saved-opportunities", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          opportunityId,
          opportunityType,
          title,
          status: "saved"
        })
      });
    }
  }

  async function createAlert() {
    const id = actionKey(opportunityType, opportunityId);
    const nextAlerted = !isAlerted;
    setIsAlerted(nextAlerted);

    if (!nextAlerted) {
      removeId(alertsKey, id);
      return;
    }

    writeId(alertsKey, id);

    await fetch("/api/alerts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        frequency: "weekly",
        filters: {
          ...alertFilters,
          opportunityId,
          opportunityType
        }
      })
    });
  }

  return (
    <div className="card-actions" aria-label="Azioni opportunita">
      <button
        aria-pressed={isSaved}
        className={isSaved ? "icon-action active" : "icon-action"}
        onClick={saveOpportunity}
        title={isSaved ? "Salvata nei preferiti" : "Salva nei preferiti"}
        type="button"
      >
        <Bookmark size={17} />
      </button>
      <button
        aria-pressed={isAlerted}
        className={isAlerted ? "icon-action active" : "icon-action"}
        onClick={createAlert}
        title={isAlerted ? "Alert attivo" : "Crea alert"}
        type="button"
      >
        <Bell size={17} />
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

function readIds(key: string) {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function writeId(key: string, id: string) {
  const ids = readIds(key);
  if (ids.includes(id)) return;
  window.localStorage.setItem(key, JSON.stringify([id, ...ids]));
}

function removeId(key: string, id: string) {
  const ids = readIds(key).filter((item) => item !== id);
  window.localStorage.setItem(key, JSON.stringify(ids));
}

function actionKey(type: OpportunityType, id: string) {
  return `${type}:${id}`;
}

export { favoritesEvent };
