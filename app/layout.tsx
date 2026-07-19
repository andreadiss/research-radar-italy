import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Research Radar Italy | Posizioni accademiche e grant in Italia",
    template: "%s | Research Radar Italy"
  },
  description:
    "Trova posizioni accademiche, contratti di ricerca, dottorati, postdoc e grant in Italia da fonti ufficiali come MUR/Cineca, PRIN, PNRR, ERC e MSCA.",
  applicationName: "Research Radar Italy",
  keywords: [
    "bandi ricerca Italia",
    "posizioni accademiche Italia",
    "dottorati Italia",
    "postdoc Italia",
    "contratti di ricerca",
    "bandi MUR",
    "PRIN",
    "PNRR ricerca",
    "ERC grants",
    "MSCA"
  ],
  authors: [{ name: "Research Radar Italy" }],
  creator: "Research Radar Italy",
  publisher: "Research Radar Italy",
  category: "education",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/favicon.svg"
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    languages: { "it-IT": siteUrl }
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: "Research Radar Italy",
    title: "Research Radar Italy | Posizioni accademiche e grant in Italia",
    description:
      "Un radar per trovare opportunita accademiche e funding call in Italia da fonti ufficiali, con filtri per tipo, materia e programma.",
    images: [{ url: "/og-research-radar.png", width: 1200, height: 630, alt: "Research Radar Italy" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Radar Italy | Posizioni accademiche e grant in Italia",
    description:
      "Trova posizioni accademiche, dottorati, postdoc e grant in Italia da fonti ufficiali.",
    images: ["/og-research-radar.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
