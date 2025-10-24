export interface ProjectMetrics {
  pagespeedScore: number | null;
  seoScore: number | null;
  lcp: number | null;
  cls: number | null;
  fid: number | null;
  analyzedAt: string;
}

export interface KeywordRecord {
  term: string;
  volume: number | null;
  cpc: number | null;
  difficulty: number | null;
  position: number | null;
  serpResults?: SerpResultItem[];
}

export interface SerpResultItem {
  position: number;
  domain: string;
  url: string;
  title: string | null;
  snippet: string | null;
}

export interface CompetitorRecord {
  domain: string;
  frequency: number;
  averageRank: number | null;
  visibility: number | null;
  sharedKeywords: number | null;
}

export interface ProjectRecord {
  projectId: string;
  name: string;
  siteUrl: string;
  keywords: KeywordRecord[];
  competitors: CompetitorRecord[];
  metrics: ProjectMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary {
  projectId: string;
  name: string;
  siteUrl: string;
  pagespeedScore: number | null;
  averageRank: number | null;
  topKeyword: string | null;
  competitorCount: number;
  createdAt: string;
}
