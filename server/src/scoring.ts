import { ScoreMap, TopFix } from "./types";

export type IssueImpact = "high" | "medium" | "low";

export interface Issue {
  id: string;
  title: string;
  why: string;
  howToFix: string;
  impact: IssueImpact;
  categories: Array<Exclude<keyof ScoreMap, "overall">>;
  penalty: number;
}

const CATEGORY_BASE: ScoreMap = {
  technical: 100,
  contentTags: 100,
  performance: 100,
  mobile: 100,
  navigability: 100,
  social: 100,
  overall: 100,
};

const CATEGORY_WEIGHTS: Record<
  Exclude<keyof ScoreMap, "overall">,
  number
> = {
  technical: 0.25,
  contentTags: 0.15,
  performance: 0.2,
  mobile: 0.15,
  navigability: 0.15,
  social: 0.1,
};

export function computeScores(
  issues: Issue[],
): { scores: ScoreMap; topFixes: TopFix[] } {
  const scores: ScoreMap = { ...CATEGORY_BASE };

  issues.forEach((issue) => {
    issue.categories.forEach((category) => {
      const current = scores[category];
      scores[category] = Math.max(0, current - issue.penalty);
    });
  });

  const overall =
    (Object.entries(CATEGORY_WEIGHTS) as Array<
      [Exclude<keyof ScoreMap, "overall">, number]
    >).reduce((acc, [category, weight]) => {
      return acc + scores[category] * weight;
    }, 0) ?? 0;

  scores.overall = Math.round(overall);

  const topFixes = buildTopFixes(issues);

  return {
    scores: clampScores(scores),
    topFixes,
  };
}

function buildTopFixes(issues: Issue[]): TopFix[] {
  const impactOrder: Record<IssueImpact, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  const sorted = [...issues].sort((a, b) => {
    const byImpact =
      impactOrder[a.impact] - impactOrder[b.impact];
    if (byImpact !== 0) {
      return byImpact;
    }
    return b.penalty - a.penalty;
  });

  return sorted.slice(0, 5).map((issue) => ({
    title: issue.title,
    why: issue.why,
    howToFix: issue.howToFix,
    impact: issue.impact,
  }));
}

function clampScores(scores: ScoreMap): ScoreMap {
  return Object.entries(scores).reduce((acc, [key, value]) => {
    acc[key as keyof ScoreMap] = Math.min(100, Math.max(0, Math.round(value)));
    return acc;
  }, {} as ScoreMap);
}
