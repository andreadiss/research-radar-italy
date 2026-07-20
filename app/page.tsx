import type { Metadata } from "next";
import { Suspense } from "react";
import { RadarApp } from "@/app/components/RadarApp";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { seoLandingPages } from "@/lib/seo-landing-pages";

export const metadata: Metadata = {
  title: "Research Radar Italy | Posizioni accademiche e grant in Italia",
  description: "Trova posizioni accademiche, dottorati, postdoc, contratti di ricerca e grants in Italia da fonti ufficiali.",
  alternates: { canonical: absoluteUrl("/") }
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(buildHomeStructuredData()) }} />
      <Suspense fallback={null}>
        <RadarApp />
      </Suspense>
    </>
  );
}

function buildHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: "Research Radar Italy",
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon-192.png"),
        description: "Research Radar Italy aggrega opportunita accademiche, posizioni di ricerca e funding call in Italia da fonti ufficiali.",
        areaServed: { "@type": "Country", name: "Italia" },
        knowsAbout: ["Bandi MUR", "Dottorati", "Postdoc", "Contratti di ricerca", "PRIN", "MSCA", "ERC"]
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: "Research Radar Italy",
        alternateName: "RR Italy",
        url: absoluteUrl("/"),
        inLanguage: "it-IT",
        publisher: { "@id": absoluteUrl("/#organization") },
        potentialAction: {
          "@type": "SearchAction",
          target: absoluteUrl("/") + "?intent=posizioni&q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebApplication",
        "@id": absoluteUrl("/#app"),
        name: "Research Radar Italy",
        url: absoluteUrl("/"),
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        inLanguage: "it-IT",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        featureList: [
          "Ricerca posizioni accademiche in Italia",
          "Filtri per tipo di posizione e materia",
          "Grants & Funding da fonti ufficiali",
          "Preferiti e liste personali"
        ]
      },
      {
        "@type": "ItemList",
        "@id": absoluteUrl("/#popular-searches"),
        name: "Ricerche accademiche popolari in Italia",
        itemListElement: seoLandingPages.map((page, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: page.shortLabel,
          url: absoluteUrl(page.path)
        }))
      }
    ]
  };
}
