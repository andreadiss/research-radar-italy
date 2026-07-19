"use client";

import { ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { favoritesEvent, readFavorites, type Favorite } from "@/app/components/OpportunityActions";
import { TrackedLink } from "@/app/components/TrackedLink";

type SavedPreviewItem = {
  label: string;
  title: string;
};

type HomeFavoritesPreviewProps = {
  count: number;
  items: SavedPreviewItem[];
};

export function HomeFavoritesPreview({ count, items }: HomeFavoritesPreviewProps) {
  const [localFavorites, setLocalFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const updateFavorites = () => setLocalFavorites(readFavorites());

    updateFavorites();
    window.addEventListener(favoritesEvent, updateFavorites);
    window.addEventListener("storage", updateFavorites);

    return () => {
      window.removeEventListener(favoritesEvent, updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, []);

  const localItems = localFavorites.slice(0, 3).map((favorite) => ({
    label: favorite.type === "grant" ? "Grant" : "Posizione",
    title: favorite.title
  }));
  const previewItems = localItems.length > 0 ? localItems : items.slice(0, 3);
  const total = localFavorites.length > 0 ? localFavorites.length : count;

  if (total === 0) return null;

  return (
    <TrackedLink
      className="next-action-card favorites-preview-card"
      event="favorites_resume_clicked"
      href="/lists"
      properties={{ saved_count: total }}
    >
      <ListChecks size={20} />
      <span>
        <strong>Riprendi dai preferiti</strong>
        {previewItems.length > 0 ? (
          <>
            <small>{total} salvate nella tua lista</small>
            <span className="saved-preview-list">
              {previewItems.map((item) => (
                <span className="saved-preview-item" key={`${item.label}-${item.title}`}>
                  <em>{item.label}</em>
                  <b>{item.title}</b>
                </span>
              ))}
            </span>
          </>
        ) : (
          <small>Vai a Le mie liste e continua dalle opportunità salvate.</small>
        )}
      </span>
    </TrackedLink>
  );
}
