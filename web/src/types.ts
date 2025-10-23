export type ScoreCategory =
  | "technical"
  | "contentTags"
  | "performance"
  | "mobile"
  | "navigability"
  | "social"
  | "overall";

export interface ScoreMap {
  technical: number;
  contentTags: number;
  performance: number;
  mobile: number;
  navigability: number;
  social: number;
  overall: number;
}

export type FixImpact = "high" | "medium" | "low";

export interface TopFix {
  title: string;
  why: string;
  howToFix: string;
  impact: FixImpact;
}

export interface CheckDetail {
  category: string;
  item: string;
  passed: boolean;
  details?: string;
}

export interface SeoReport {
  url: string;
  analyzedAt: string;
  status: "ok" | "error";
  scores: ScoreMap;
  summary: Record<string, unknown>;
  topFixes: TopFix[];
  checks: CheckDetail[];
}
