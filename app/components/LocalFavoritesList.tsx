"use client";

import Link from "next/link";
import type { Route } from "next";
import { Bookmark, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { favoritesEvent, readFavorites, type Favorite } from "@/app/components/OpportunityActions";
import { OpportunityPreview } from "@/app/components/OpportunityPreview";
import { RemoveFavoriteButton } from "@/app/components/RemoveFavoriteButton";

type LocalFavoritesListProps = {
  excludedKeys: string[];
  showEmptyState: boolean;
};

export function LocalFavoritesList({ excludedKeys, showEmptyState }: LocalFavoritesListProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const excluded = new Set(excludedKeys);
    const updateFavorites = () =>
      setFavorites(readFavorites().filter((favorite) => !excluded.has(`${favorite.type}:${favorite.id}`)));

    updateFavorites();
    window.addEventListener(favoritesEvent, updateFavorites);
    window.addEventListener("storage", updateFavorites);

    return () => {
      window.removeEventListener(favoritesEvent, updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, [excludedKeys]);

  if (favorites.length === 0) {
    if (!showEmptyState) return null;

    return (
      <div className="empty-state">
        <Bookmark size={24} />
        <h3>Nessun preferito salvato</h3>
        <p>Apri una posizione o un grant e usa l'icona bookmark per aggiungerlo alla lista.</p>
        <Link className="button primary" href="/?intent=posizioni">
          Trova opportunità
        </Link>
      </div>
    );
  }

  return (
    <div className="saved-list">
      {favorites.map((favorite) => (
        <article className="saved-list-card" key={`${favorite.type}-${favorite.id}`}>
          <div>
            <span className="badge type">{favorite.type === "grant" ? "Grant" : "Posizione"}</span>
            <h2>{favorite.title}</h2>
            <p>Salvata su questo browser</p>
          </div>
          <div className="saved-list-actions">
            <OpportunityPreview
              detailHref={favorite.detailHref as Route}
              meta="Preferito salvato nel browser"
              summary="Apri l'anteprima per riprendere il bando senza lasciare subito questa pagina."
              title={favorite.title}
              triggerClassName="button secondary"
            >
              Anteprima
            </OpportunityPreview>
            <Link className="button secondary" href={favorite.detailHref as Route}>
              <ExternalLink size={16} />
              Apri
            </Link>
            <RemoveFavoriteButton opportunityId={favorite.id} opportunityType={favorite.type} />
          </div>
        </article>
      ))}
    </div>
  );
}
