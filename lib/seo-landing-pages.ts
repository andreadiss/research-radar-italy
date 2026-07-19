import type { PositionType } from "@/lib/types";

export type SeoLandingPage = {
  segments: ["posizioni" | "funding", string];
  path: string;
  kind: "positions" | "grants";
  shortLabel: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  filter: { type?: PositionType; program?: string };
  primaryHref: string;
  primaryLabel: string;
  guideTitle: string;
  guide: string[];
  faqs: Array<{ question: string; answer: string }>;
  keywords: string[];
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    segments: ["posizioni", "dottorati"],
    path: "/posizioni/dottorati",
    kind: "positions",
    shortLabel: "Dottorati",
    title: "Bandi di dottorato in Italia",
    metaTitle: "Bandi di dottorato in Italia: PhD aperti",
    description: "Consulta bandi di dottorato e posizioni PhD aperte in Italia, con scadenze, universita, discipline e link alle fonti ufficiali MUR/Cineca.",
    intro: "Una vista aggiornata dei bandi di dottorato pubblicati dalle universita italiane. Confronta materia, sede e scadenza, poi verifica requisiti e modalita di candidatura nella fonte ufficiale.",
    filter: { type: "PhD" },
    primaryHref: "/?intent=posizioni&type=PhD",
    primaryLabel: "Vedi tutti i dottorati",
    guideTitle: "Come trovare il dottorato giusto",
    guide: [
      "Parti dalla disciplina e controlla il settore scientifico indicato nel bando.",
      "Verifica scadenza, requisiti di accesso, borsa e documenti richiesti sulla fonte ufficiale.",
      "Confronta piu programmi: titoli simili possono avere progetti, supervisori e vincoli molto diversi."
    ],
    faqs: [
      { question: "Dove trovo i bandi di dottorato aperti in Italia?", answer: "Research Radar Italy raccoglie i bandi disponibili dalle fonti MUR/Cineca e rimanda sempre alla pagina ufficiale dell'universita o dell'ente." },
      { question: "I bandi mostrati sono ufficiali?", answer: "Le schede sono normalizzate per facilitare la ricerca, ma requisiti, scadenze e modalita di candidatura vanno confermati nella fonte ufficiale collegata." },
      { question: "Posso filtrare i PhD per materia?", answer: "Si. Dalla vista completa puoi combinare il filtro PhD con una o piu macro-discipline per restringere i risultati." }
    ],
    keywords: ["bandi dottorato Italia", "PhD Italia", "dottorati aperti", "borse dottorato"]
  },
  {
    segments: ["posizioni", "postdoc"],
    path: "/posizioni/postdoc",
    kind: "positions",
    shortLabel: "Postdoc",
    title: "Posizioni postdoc in Italia",
    metaTitle: "Postdoc in Italia: posizioni e bandi aperti",
    description: "Trova posizioni postdoc aperte in Italia per disciplina, universita e scadenza, con collegamento diretto ai bandi ufficiali.",
    intro: "Esplora incarichi postdoc e opportunita di ricerca dopo il dottorato. Ogni scheda sintetizza i dati utili per una prima valutazione e mantiene il link alla fonte ufficiale.",
    filter: { type: "Postdoc" },
    primaryHref: "/?intent=posizioni&type=Postdoc",
    primaryLabel: "Vedi tutti i postdoc",
    guideTitle: "Cosa controllare prima di candidarsi",
    guide: [
      "Coerenza del progetto con il tuo profilo scientifico.",
      "Durata, importo, sede e data di inizio prevista.",
      "Requisiti formali e documenti richiesti dal bando ufficiale."
    ],
    faqs: [
      { question: "Che cosa include la categoria Postdoc?", answer: "Include gli incarichi post doc classificati dalle fonti ufficiali e normalizzati come opportunita successive al dottorato." },
      { question: "Le posizioni sono aggiornate?", answer: "Il dataset viene rigenerato dalla pipeline automatica; la data e la fonte ufficiale restano visibili in ogni scheda." },
      { question: "Posso cercare postdoc per settore scientifico?", answer: "Si. Le schede riportano disciplina e, quando disponibile, SSD o GSD per rendere piu precisa la selezione." }
    ],
    keywords: ["postdoc Italia", "posizioni postdoc", "bandi postdoc Italia", "incarichi post doc"]
  },
  {
    segments: ["posizioni", "contratti-di-ricerca"],
    path: "/posizioni/contratti-di-ricerca",
    kind: "positions",
    shortLabel: "Contratti di ricerca",
    title: "Contratti di ricerca aperti in Italia",
    metaTitle: "Contratti di ricerca in Italia: bandi aperti",
    description: "Consulta contratti di ricerca aperti nelle universita italiane con disciplina, SSD, sede, scadenza e fonte ufficiale MUR/Cineca.",
    intro: "Tutti i contratti di ricerca disponibili nel radar, organizzati per materia e collegati al bando ufficiale. Usa questa pagina per orientarti, poi controlla il testo integrale prima di candidarti.",
    filter: { type: "Contratto di ricerca" },
    primaryHref: "/?intent=posizioni&type=Contratto+di+ricerca",
    primaryLabel: "Vedi tutti i contratti",
    guideTitle: "Leggere un contratto di ricerca",
    guide: [
      "Controlla oggetto e obiettivi del progetto.",
      "Verifica durata, importo, requisiti e incompatibilita.",
      "Usa SSD e dipartimento per valutare la reale affinita scientifica."
    ],
    faqs: [
      { question: "Dove sono pubblicati i contratti di ricerca?", answer: "Le opportunita arrivano dalle fonti MUR/Cineca e dalle pagine ufficiali indicate in ogni scheda." },
      { question: "Quali dati posso confrontare?", answer: "Titolo, universita, disciplina, SSD o GSD, sede, data di pubblicazione e scadenza." },
      { question: "Research Radar sostituisce il bando?", answer: "No. Il radar semplifica scoperta e confronto, mentre il testo ufficiale resta l'unico riferimento per la candidatura." }
    ],
    keywords: ["contratti di ricerca Italia", "bandi contratti ricerca", "contratto ricerca universita"]
  },
  {
    segments: ["posizioni", "ricercatori-tempo-determinato"],
    path: "/posizioni/ricercatori-tempo-determinato",
    kind: "positions",
    shortLabel: "Ricercatori RTT",
    title: "Bandi per ricercatori a tempo determinato in Italia",
    metaTitle: "Ricercatori a tempo determinato: bandi RTT",
    description: "Trova bandi RTT e posizioni da ricercatore a tempo determinato nelle universita italiane, filtrabili per disciplina e scadenza.",
    intro: "Una raccolta navigabile delle procedure per ricercatori a tempo determinato, con dati essenziali normalizzati e accesso diretto alla fonte ufficiale.",
    filter: { type: "RTT" },
    primaryHref: "/?intent=posizioni&type=RTT",
    primaryLabel: "Vedi tutti i bandi RTT",
    guideTitle: "Valutare una posizione RTT",
    guide: [
      "Identifica gruppo scientifico disciplinare e settore.",
      "Controlla attivita di ricerca, didattica e criteri di selezione.",
      "Verifica termini e allegati direttamente nel bando ufficiale."
    ],
    faqs: [
      { question: "Che cosa significa RTT?", answer: "Nel radar RTT identifica le procedure per ricercatori a tempo determinato classificate dalle fonti MUR." },
      { question: "Posso filtrare per area disciplinare?", answer: "Si. La vista completa permette di combinare il tipo RTT con piu discipline." },
      { question: "Dove verifico i requisiti?", answer: "Apri la fonte ufficiale indicata nella scheda: e il riferimento valido per requisiti, allegati e candidatura." }
    ],
    keywords: ["bandi RTT", "ricercatore tempo determinato", "posizioni ricercatore universita"]
  },
  fundingPage("prin", "Bandi PRIN", "Bandi PRIN e finanziamenti per la ricerca", "Bandi PRIN: call e scadenze", "PRIN", "Consulta bandi PRIN, scadenze, requisiti e fonti ufficiali per il finanziamento di progetti di ricerca in Italia.", ["bando PRIN", "PRIN Italia", "finanziamenti ricerca PRIN"]),
  fundingPage("msca", "MSCA", "Marie Sklodowska-Curie Actions: call e funding", "MSCA: call e finanziamenti per ricercatori", "MSCA", "Trova call MSCA, Postdoctoral Fellowships e opportunita Marie Sklodowska-Curie con scadenze e link alle fonti ufficiali.", ["MSCA call", "Marie Curie fellowship Italia", "MSCA Postdoctoral Fellowships"]),
  fundingPage("erc", "ERC", "ERC Grants: call europee per la ricerca", "ERC Grants: call, scadenze e fonti ufficiali", "ERC", "Consulta opportunita ERC, scadenze ed eligibility per Starting, Consolidator e Advanced Grants con link alle fonti ufficiali.", ["ERC grants Italia", "ERC Starting Grant", "ERC Consolidator Grant", "ERC Advanced Grant"])
];

function fundingPage(slug: string, shortLabel: string, title: string, metaTitle: string, program: string, description: string, keywords: string[]): SeoLandingPage {
  return {
    segments: ["funding", slug],
    path: `/funding/${slug}`,
    kind: "grants",
    shortLabel,
    title,
    metaTitle,
    description,
    intro: `Segui le call ${program} presenti nel radar e accedi rapidamente alla fonte ufficiale per documenti, scadenze, budget ed eligibility.`,
    filter: { program },
    primaryHref: `/?intent=bandi&program=${program}`,
    primaryLabel: `Vedi le call ${program}`,
    guideTitle: `Orientarsi nelle call ${program}`,
    guide: [
      "Verifica la linea di finanziamento e i soggetti ammissibili.",
      "Controlla scadenza, budget e documentazione ufficiale.",
      "Consulta sempre la fonte ufficiale prima di preparare la proposta."
    ],
    faqs: [
      { question: `Dove trovo la call ${program} ufficiale?`, answer: "Ogni scheda collega il portale o documento ufficiale da cui provengono le informazioni." },
      { question: "Quali dati mostra Research Radar?", answer: "Programma, stato, disciplina, scadenza, sintesi, eligibility e fonte ufficiale quando disponibili." },
      { question: "Research Radar accetta candidature?", answer: "No. Il sito aiuta a scoprire la call; la candidatura avviene esclusivamente sui portali ufficiali." }
    ],
    keywords
  };
}

export function getSeoLandingPage(segments: string[]) {
  return seoLandingPages.find((page) => page.segments.join("/") === segments.join("/"));
}
