-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users table mirrors Supabase auth.users but allows storing metadata
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_tier text not null default 'free',
  notifications_enabled boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists settings_user_idx on public.settings(user_id);

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  domain text not null,
  plan_tier text not null default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create unique index if not exists projects_user_domain_idx on public.projects(user_id, domain);
create index if not exists projects_created_idx on public.projects(created_at);

create table if not exists public.audits (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  score integer not null,
  metrics jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists audits_project_idx on public.audits(project_id);
create index if not exists audits_created_idx on public.audits(created_at);

create table if not exists public.audit_issues (
  id uuid primary key default uuid_generate_v4(),
  audit_id uuid not null references public.audits(id) on delete cascade,
  type text not null,
  severity text not null,
  description text not null,
  url text,
  status text not null default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists audit_issues_audit_idx on public.audit_issues(audit_id);
create index if not exists audit_issues_severity_idx on public.audit_issues(severity);
create index if not exists audit_issues_status_idx on public.audit_issues(status);

create table if not exists public.keywords (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  keyword text not null,
  location text not null,
  device text not null default 'desktop',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists keywords_project_idx on public.keywords(project_id);
create unique index if not exists keywords_project_keyword_idx on public.keywords(project_id, keyword, location, device);

create table if not exists public.rankings (
  id uuid primary key default uuid_generate_v4(),
  keyword_id uuid not null references public.keywords(id) on delete cascade,
  position integer not null,
  search_volume integer,
  serp_features jsonb,
  captured_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists rankings_keyword_idx on public.rankings(keyword_id);
create index if not exists rankings_captured_idx on public.rankings(captured_at);

create table if not exists public.competitors (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  domain text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create unique index if not exists competitors_project_domain_idx on public.competitors(project_id, domain);

create table if not exists public.competitor_audits (
  id uuid primary key default uuid_generate_v4(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  metric text not null,
  value numeric not null,
  captured_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists competitor_audits_competitor_idx on public.competitor_audits(competitor_id);
create index if not exists competitor_audits_metric_idx on public.competitor_audits(metric);

create table if not exists public.competitor_keywords (
  id uuid primary key default uuid_generate_v4(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  keyword text not null,
  position integer not null,
  overlap numeric,
  captured_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists competitor_keywords_keyword_idx on public.competitor_keywords(keyword);

create table if not exists public.competitor_backlinks (
  id uuid primary key default uuid_generate_v4(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  referring_domains integer not null,
  authority_score numeric not null,
  captured_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists competitor_backlinks_competitor_idx on public.competitor_backlinks(competitor_id);

create table if not exists public.content_scores (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  page_id text not null,
  keyword text not null,
  score numeric not null,
  intent text not null,
  summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists content_scores_project_idx on public.content_scores(project_id);
create unique index if not exists content_scores_project_page_idx on public.content_scores(project_id, page_id, keyword);

create table if not exists public.backlinks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_url text not null,
  target_url text not null,
  anchor_text text,
  toxicity_score numeric,
  status text not null default 'active',
  first_seen timestamp with time zone default timezone('utc'::text, now()) not null,
  last_seen timestamp with time zone
);
create index if not exists backlinks_project_idx on public.backlinks(project_id);
create index if not exists backlinks_status_idx on public.backlinks(status);

create table if not exists public.backlink_trends (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  total_links integer not null,
  lost_links integer not null,
  new_links integer not null,
  captured_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists backlink_trends_project_idx on public.backlink_trends(project_id);

create table if not exists public.toxic_links (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_url text not null,
  toxicity_reason text not null,
  toxicity_score numeric not null,
  detected_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists toxic_links_project_idx on public.toxic_links(project_id);

create table if not exists public.issues (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null,
  severity text not null,
  pages_affected integer not null default 0,
  impact_score numeric not null,
  ai_summary text,
  status text not null default 'open',
  last_seen timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists issues_project_idx on public.issues(project_id);
create index if not exists issues_severity_idx on public.issues(severity);
create index if not exists issues_status_idx on public.issues(status);
create index if not exists issues_last_seen_idx on public.issues(last_seen);

create table if not exists public.issue_pages (
  id uuid primary key default uuid_generate_v4(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  url text not null,
  status text not null default 'open',
  traffic_loss numeric,
  last_checked timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists issue_pages_issue_idx on public.issue_pages(issue_id);
create unique index if not exists issue_pages_unique_url_idx on public.issue_pages(issue_id, url);

create table if not exists public.fix_logs (
  id uuid primary key default uuid_generate_v4(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  action text not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists fix_logs_issue_idx on public.fix_logs(issue_id);
create index if not exists fix_logs_user_idx on public.fix_logs(user_id);

comment on table public.issues is 'Technical issue explorer primary index. Populated via DataForSEO OnPage results.';
comment on column public.issues.impact_score is 'Composite metric: severity_weight * frequency * estimated traffic loss.';
