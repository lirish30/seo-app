import { addDays, subDays } from "date-fns";

export const projectId = "proj-demo";

export const mockAuditSummary = {
  score: 82,
  issuesOpen: 23,
  issuesResolvedThisWeek: 12,
  vitals: {
    lcp: 2.7,
    cls: 0.09,
    inp: 240
  },
  crawlHealth: {
    crawledPages: 430,
    blockedPages: 12,
    brokenLinks: 7
  }
};

export const mockAuditIssues = [
  {
    id: "issue-1",
    type: "Indexability",
    severity: "high",
    pages: 32,
    impact: 78,
    status: "open"
  },
  {
    id: "issue-2",
    type: "Metadata",
    severity: "medium",
    pages: 14,
    impact: 42,
    status: "monitoring"
  },
  {
    id: "issue-3",
    type: "Speed",
    severity: "critical",
    pages: 9,
    impact: 92,
    status: "open"
  },
  {
    id: "issue-4",
    type: "Security",
    severity: "low",
    pages: 5,
    impact: 16,
    status: "resolved"
  }
] as const;

export const mockIssueDetails = {
  "issue-1": {
    title: "Robots.txt Blocking Revenue Pages",
    aiSummary:
      "Several high-value product pages are blocked by the robots.txt file, preventing Google from indexing them. This reduces organic reach for commercial terms and diminishes conversions.",
    recommendations: [
      "Update robots.txt to allow crawling of /products/ paths.",
      "Submit updated sitemap to ensure Google re-indexes impacted URLs.",
      "Set up monitoring to alert when critical sections get blocked."
    ],
    affectedPages: [
      {
        url: "https://demo.com/products/ai-platform",
        status: "open",
        traffic_loss: 340
      },
      {
        url: "https://demo.com/products/automation-suite",
        status: "open",
        traffic_loss: 210
      },
      {
        url: "https://demo.com/products/workflow-engine",
        status: "open",
        traffic_loss: 125
      }
    ],
    history: [
      {
        id: "log-1",
        action: "Detected robots.txt change blocking /products",
        user: "System",
        created_at: subDays(new Date(), 6).toISOString()
      },
      {
        id: "log-2",
        action: "Requested engineering review",
        user: "Logan Irish",
        created_at: subDays(new Date(), 5).toISOString()
      }
    ]
  },
  "issue-2": {
    title: "Missing Meta Descriptions",
    aiSummary:
      "Several key solution pages lack unique meta descriptions. This can reduce click-through rate from SERPs and make it harder for searchers to understand the page relevance.",
    recommendations: [
      "Author concise, keyword-rich meta descriptions for impacted pages.",
      "Ensure each description stays under 160 characters.",
      "Automate verification as part of publishing workflow."
    ],
    affectedPages: [
      {
        url: "https://demo.com/solutions/operations",
        status: "monitoring",
        traffic_loss: 80
      },
      {
        url: "https://demo.com/solutions/customer-success",
        status: "open",
        traffic_loss: 55
      }
    ],
    history: [
      {
        id: "log-3",
        action: "Content team flagged duplicate snippets",
        user: "Nia Patel",
        created_at: subDays(new Date(), 10).toISOString()
      }
    ]
  },
  "issue-3": {
    title: "Cumulative Layout Shift Above Threshold",
    aiSummary:
      "Several landing pages shift layout due to late-loading ads and hero images. CLS above 0.25 risks poor user experience and failing Core Web Vitals requirements.",
    recommendations: [
      "Reserve image and embed dimensions to avoid layout shift.",
      "Lazy-load non-critical hero assets below the fold.",
      "Introduce skeleton placeholders for interactive components."
    ],
    affectedPages: [
      {
        url: "https://demo.com/landing/ai-suite",
        status: "open",
        traffic_loss: 150
      },
      {
        url: "https://demo.com/landing/automation",
        status: "open",
        traffic_loss: 120
      }
    ],
    history: [
      {
        id: "log-4",
        action: "Issue detected during weekly lighthouse sweep",
        user: "System",
        created_at: subDays(new Date(), 3).toISOString()
      }
    ]
  },
  "issue-4": {
    title: "Mixed Content Warnings",
    aiSummary:
      "A handful of knowledge base articles are embedding HTTP content, causing mixed-content warnings in browsers and reducing trust.",
    recommendations: [
      "Upgrade embedded assets to HTTPS or proxy via CDN.",
      "Enable automatic HTTPS rewrites for legacy assets.",
      "Run security scan weekly to catch new mixed content."
    ],
    affectedPages: [
      {
        url: "https://demo.com/kb/getting-started",
        status: "resolved",
        traffic_loss: 20
      }
    ],
    history: [
      {
        id: "log-5",
        action: "Fixed embedded video protocol",
        user: "Alex Morgan",
        created_at: subDays(new Date(), 1).toISOString()
      }
    ]
  }
} as const;

export const mockIssueTrend = Array.from({ length: 12 }).map((_, index) => {
  const date = subDays(new Date(), (11 - index) * 7);
  return {
    date: date.toISOString(),
    open: Math.max(5, 20 - index),
    resolved: Math.max(2, index + 3)
  };
});

export const mockKeywordHistory = [
  {
    keyword: "b2b workflow automation",
    trend: Array.from({ length: 10 }).map((_, index) => ({
      date: subDays(new Date(), 9 - index).toISOString(),
      position: 12 - index
    })),
    competitors: [
      { domain: "competitor-one.com", position: 8 },
      { domain: "competitor-two.com", position: 5 }
    ]
  },
  {
    keyword: "ai operations platform",
    trend: Array.from({ length: 10 }).map((_, index) => ({
      date: subDays(new Date(), 9 - index).toISOString(),
      position: 20 - index * 2
    })),
    competitors: [
      { domain: "competitor-one.com", position: 14 },
      { domain: "competitor-two.com", position: 11 }
    ]
  }
];

export const mockCompetitorOverview = [
  {
    domain: "competitor-one.com",
    traffic: 40230,
    overlap: 68,
    authority: 57,
    backlinks: 1290
  },
  {
    domain: "competitor-two.com",
    traffic: 32500,
    overlap: 55,
    authority: 52,
    backlinks: 980
  },
  {
    domain: "competitor-three.com",
    traffic: 21890,
    overlap: 37,
    authority: 49,
    backlinks: 730
  }
];

export const mockKeywordGap = [
  {
    keyword: "workflow orchestration",
    ourPosition: null,
    competitorPosition: 4,
    volume: 2400
  },
  {
    keyword: "process automation software",
    ourPosition: 18,
    competitorPosition: 6,
    volume: 4400
  },
  {
    keyword: "bpm platform",
    ourPosition: null,
    competitorPosition: 8,
    volume: 3200
  }
];

export const mockBacklinkDistribution = {
  authoritative: 45,
  neutral: 35,
  toxic: 20
};

export const mockBacklinkTrend = Array.from({ length: 12 }).map((_, index) => ({
  date: addDays(subDays(new Date(), 60), index * 5).toISOString(),
  total: 400 + index * 15,
  newLinks: Math.round(Math.random() * 15) + 5,
  lostLinks: Math.round(Math.random() * 10)
}));

export const mockToxicLinks = [
  {
    id: "tox-1",
    source_url: "https://spammydirectory.com/profile/crawlbase",
    toxicity_reason: "Link farm directory",
    toxicity_score: 78,
    detected_at: subDays(new Date(), 4).toISOString()
  },
  {
    id: "tox-2",
    source_url: "http://oldforum.net/thread/ai-tools",
    toxicity_reason: "Mixed content + suspicious anchor",
    toxicity_score: 65,
    detected_at: subDays(new Date(), 9).toISOString()
  }
];

export const mockContentScores = [
  {
    pageId: "sample-page",
    url: "https://demo.com/blog/ai-automation",
    intent: "Informational",
    score: 74,
    topicCluster: "Automation",
    wordCount: 1860,
    primaryKeyword: "ai automation platform"
  },
  {
    pageId: "another-page",
    url: "https://demo.com/blog/customer-ops",
    intent: "Informational",
    score: 81,
    topicCluster: "Customer Operations",
    wordCount: 2140,
    primaryKeyword: "customer operations automation"
  }
];

export const mockContentSuggestions = [
  {
    heading: "Clarify integration timeline",
    suggestion:
      "Add a section detailing how long it takes to deploy the automation suite, highlighting onboarding best practices."
  },
  {
    heading: "Highlight customer proof",
    suggestion:
      "Include 2-3 testimonials or ROI metrics from SaaS customers to build trust and substantiate claims."
  },
  {
    heading: "Refine CTA placement",
    suggestion:
      "Introduce a mid-article CTA linking to the interactive ROI calculator to capture high-intent readers."
  }
];
