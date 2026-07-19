export type PositionType =
  | "PhD"
  | "Assegno"
  | "Postdoc"
  | "Contratto di ricerca"
  | "Incarico di ricerca"
  | "RTT"
  | "Tecnologo"
  | "Professore I fascia"
  | "Professore II fascia"
  | "Professore straordinario";

export type FundingType = "MUR" | "PNRR" | "PRIN" | "ERC" | "Horizon" | "MSCA" | "Dipartimentale";
export type DeadlineStatus = "open" | "closing_soon" | "expired" | "unknown";
export type ReviewStatus = "auto_published" | "needs_review" | "duplicate" | "rejected";

export type GrantOpportunity = {
  id: string;
  title: string;
  program: string;
  funder: string;
  discipline: string;
  deadline: string;
  deadlineStatus?: DeadlineStatus;
  firstSeenAt?: string;
  publishedAt?: string;
  opensAt?: string;
  sourceName: string;
  sourceUrl: string;
  amount?: string;
  eligibility: string;
  summary: string;
  status: "open" | "upcoming" | "closed" | "source_monitoring";
  sourceType: "official_call" | "official_source" | "monitoring_source";
};

export type Position = {
  id: string;
  title: string;
  institution: string;
  department: string;
  location: string;
  region: string;
  positionType: PositionType;
  discipline: string;
  ssd: string;
  gsd?: string;
  fundingType: FundingType;
  deadline: string;
  deadlineStatus?: DeadlineStatus;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  salaryOrAmount: string;
  duration: string;
  language: "IT" | "EN" | "IT/EN";
  summary: string;
  requirements: string[];
  professorRank?: Extract<PositionType, "Professore I fascia" | "Professore II fascia" | "Professore straordinario"> | "";
  dedupeKey?: string;
  duplicateSourceIds?: string[];
  possibleDuplicateOf?: string;
  possibleDuplicateSourceIds?: string[];
  reviewStatus?: ReviewStatus;
  confidenceScore?: number;
  reviewReasons?: string[];
};
