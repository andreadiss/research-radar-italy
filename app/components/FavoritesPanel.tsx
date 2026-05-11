"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { favoritesEvent, readFavorites } from "@/app/components/OpportunityActions";

type Favorite = ReturnType<typeof readFavorites>[number];

export function FavoritesPanel() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const updateFavorites = () => setFavorites(readFavorites());

    updateFavorites();
    window.addEventListener(favoritesEvent, updateFavorites);
    window.addEventListener("storage", updateFavorites);

    return () => {
      window.removeEventListener(favoritesEvent, updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, []);

  if (favorites.length === 0) return null;

  return (
    <section className="favorites-panel" aria-label="I tuoi preferiti">
      <div className="favorites-heading">
        <h2>I tuoi preferiti</h2>
        <span>{favorites.length}</span>
      </div>
      <div className="favorites-list">
        {favorites.slice(0, 5).map((favorite) => (
          <Link className="favorite-item" href={favorite.detailHref as Route} key={`${favorite.type}-${favorite.id}`}>
            <span>{favorite.type === "grant" ? "Grant" : "Posizione"}</span>
            <strong>{favorite.title}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
