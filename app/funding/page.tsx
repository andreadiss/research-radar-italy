import type { Metadata } from "next";
import { Suspense } from "react";
import { RadarApp } from "@/app/components/RadarApp";
import { grants } from "@/lib/grants";
import { absoluteUrl, jsonLd } from "@/lib/seo";

const visibleGrants = grants.filter((grant) => grant.status === "open" || grant.status === "upcoming");

export const metadata: Metadata = {
  title: "Grants & Funding per ricerca in Italia | Research Radar Italy",
  description:
    "Trova bandi PRIN, PNRR, ERC, MSCA e funding call per ricerca accademica da fonti ufficiali.",
  alternates: { canonical: absoluteUrl("/funding") }
};

export default function FundingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(buildFundingStructuredData()) }} />
      <Suspense fallback={null}>
        <RadarApp initialIntent="bandi" />
      </Suspense>
    </>
  );
}

function buildFundingStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Grants & Funding per ricerca in Italia",
    url: absoluteUrl("/funding"),
    inLanguage: "it-IT",
    description: "Bandi e finanziamenti per ricerca accademica e scientifica da fonti ufficiali.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: visibleGrants.length,
      itemListElement: visibleGrants.map((grant, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/grants/${grant.id}`),
        name: grant.title
      }))
    }
  };
}
