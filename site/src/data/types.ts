export type Localized = { en: string; zh?: string };

export type Evidence = {
  type: string;
  url: string;
  quote?: string;
  accessed?: string;
};

export type Project = {
  id: string;
  name: string;
  summary: Localized;
  description?: Localized;
  repo_url: string | null;
  homepage_url: string | null;
  article_urls?: string[];
  harnesses: string[];
  models: string[];
  categories: string[];
  difficulty: "medium" | "high" | "very-high";
  evidence: Evidence[];
  human_involvement: string;
  human_involvement_notes?: Localized;
  verified: string;
  stars: number | null;
  stars_checked_at?: string;
  license: string | null;
  languages?: string[];
  status: string;
  listed_at?: string;
  first_public_at?: string;
  notes?: Localized;
};

export type Catalog = {
  catalog_version: number;
  stars_checked_at: string;
  projects: Project[];
};
