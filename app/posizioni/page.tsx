import type { Metadata } from "next";
import { Suspense } from "react";
import { RadarApp } from "@/app/components/RadarApp";
import { absoluteUrl, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Posizioni accademiche aperte in Italia",
  description:
    "Trova dottorati, postdoc, contratti di ricerca, incarichi, ricercatori e professori da bandi MUR/Cineca e fonti ufficiali.",
  alternates: { canonical: absoluteUrl("/posizioni") }
};

export default function PositionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(buildPositionsStructuredData()) }} />
      <Suspense fallback={null}>
        <RadarApp initialIntent="posizioni" />
      </Suspense>
    </>
  );
}

function buildPositionsStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Posizioni accademiche aperte in Italia",
    url: absoluteUrl("/posizioni"),
    inLanguage: "it-IT",
    description:
      "Lista aggiornata di posizioni accademiche e di ricerca in Italia da bandi MUR/Cineca e fonti ufficiali.",
    relatedLink: absoluteUrl("/posizioni/indice")
  };
}
