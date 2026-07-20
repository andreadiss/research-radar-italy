import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Research Radar Italy",
    short_name: "RR Italy",
    description: "Posizioni accademiche, bandi di ricerca e funding in Italia da fonti ufficiali.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfcf8",
    theme_color: "#14231c",
    lang: "it-IT",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
