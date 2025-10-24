export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          domain: string;
          name: string;
          plan_tier: "free" | "starter" | "pro" | "agency";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          domain: string;
          name: string;
          plan_tier?: "free" | "starter" | "pro" | "agency";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          domain?: string;
          name?: string;
          plan_tier?: "free" | "starter" | "pro" | "agency";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      project_records: {
        Row: {
          project_id: string;
          name: string;
          site_url: string;
          record: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          name: string;
          site_url: string;
          record: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          project_id?: string;
          name?: string;
          site_url?: string;
          record?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audits: {
        Row: {
          id: string;
          project_id: string;
          score: number;
          metrics: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          score: number;
          metrics: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          score?: number;
          metrics?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audits_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_issues: {
        Row: {
          id: string;
          audit_id: string;
          type: string;
          severity: "low" | "medium" | "high" | "critical";
          description: string;
          url: string | null;
          status: "open" | "fixed" | "ignored";
          created_at: string;
        };
        Insert: {
          id?: string;
          audit_id: string;
          type: string;
          severity: "low" | "medium" | "high" | "critical";
          description: string;
          url?: string | null;
          status?: "open" | "fixed" | "ignored";
          created_at?: string;
        };
        Update: {
          id?: string;
          audit_id?: string;
          type?: string;
          severity?: "low" | "medium" | "high" | "critical";
          description?: string;
          url?: string | null;
          status?: "open" | "fixed" | "ignored";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_issues_audit_id_fkey";
            columns: ["audit_id"];
            referencedRelation: "audits";
            referencedColumns: ["id"];
          }
        ];
      };
      keywords: {
        Row: {
          id: string;
          project_id: string;
          keyword: string;
          location: string;
          device: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          keyword: string;
          location: string;
          device: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          keyword?: string;
          location?: string;
          device?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "keywords_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      rankings: {
        Row: {
          id: string;
          keyword_id: string;
          position: number;
          search_volume: number | null;
          serp_features: Json | null;
          captured_at: string;
        };
        Insert: {
          id?: string;
          keyword_id: string;
          position: number;
          search_volume?: number | null;
          serp_features?: Json | null;
          captured_at?: string;
        };
        Update: {
          id?: string;
          keyword_id?: string;
          position?: number;
          search_volume?: number | null;
          serp_features?: Json | null;
          captured_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rankings_keyword_id_fkey";
            columns: ["keyword_id"];
            referencedRelation: "keywords";
            referencedColumns: ["id"];
          }
        ];
      };
      competitors: {
        Row: {
          id: string;
          project_id: string;
          domain: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          domain: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          domain?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "competitors_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      competitor_audits: {
        Row: {
          id: string;
          competitor_id: string;
          metric: string;
          value: number;
          captured_at: string;
        };
        Insert: {
          id?: string;
          competitor_id: string;
          metric: string;
          value: number;
          captured_at?: string;
        };
        Update: {
          id?: string;
          competitor_id?: string;
          metric?: string;
          value?: number;
          captured_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "competitor_audits_competitor_id_fkey";
            columns: ["competitor_id"];
            referencedRelation: "competitors";
            referencedColumns: ["id"];
          }
        ];
      };
      competitor_keywords: {
        Row: {
          id: string;
          competitor_id: string;
          keyword: string;
          position: number;
          overlap: number | null;
          captured_at: string;
        };
        Insert: {
          id?: string;
          competitor_id: string;
          keyword: string;
          position: number;
          overlap?: number | null;
          captured_at?: string;
        };
        Update: {
          id?: string;
          competitor_id?: string;
          keyword?: string;
          position?: number;
          overlap?: number | null;
          captured_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "competitor_keywords_competitor_id_fkey";
            columns: ["competitor_id"];
            referencedRelation: "competitors";
            referencedColumns: ["id"];
          }
        ];
      };
      competitor_backlinks: {
        Row: {
          id: string;
          competitor_id: string;
          referring_domains: number;
          authority_score: number;
          captured_at: string;
        };
        Insert: {
          id?: string;
          competitor_id: string;
          referring_domains: number;
          authority_score: number;
          captured_at?: string;
        };
        Update: {
          id?: string;
          competitor_id?: string;
          referring_domains?: number;
          authority_score?: number;
          captured_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "competitor_backlinks_competitor_id_fkey";
            columns: ["competitor_id"];
            referencedRelation: "competitors";
            referencedColumns: ["id"];
          }
        ];
      };
      content_scores: {
        Row: {
          id: string;
          project_id: string;
          page_id: string;
          keyword: string;
          score: number;
          intent: string;
          summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          page_id: string;
          keyword: string;
          score: number;
          intent: string;
          summary?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          page_id?: string;
          keyword?: string;
          score?: number;
          intent?: string;
          summary?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_scores_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      backlinks: {
        Row: {
          id: string;
          project_id: string;
          source_url: string;
          target_url: string;
          anchor_text: string | null;
          toxicity_score: number | null;
          status: "active" | "lost" | "pending";
          first_seen: string;
          last_seen: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          source_url: string;
          target_url: string;
          anchor_text?: string | null;
          toxicity_score?: number | null;
          status?: "active" | "lost" | "pending";
          first_seen?: string;
          last_seen?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          source_url?: string;
          target_url?: string;
          anchor_text?: string | null;
          toxicity_score?: number | null;
          status?: "active" | "lost" | "pending";
          first_seen?: string;
          last_seen?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "backlinks_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      backlink_trends: {
        Row: {
          id: string;
          project_id: string;
          total_links: number;
          lost_links: number;
          new_links: number;
          captured_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          total_links: number;
          lost_links: number;
          new_links: number;
          captured_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          total_links?: number;
          lost_links?: number;
          new_links?: number;
          captured_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "backlink_trends_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      toxic_links: {
        Row: {
          id: string;
          project_id: string;
          source_url: string;
          toxicity_reason: string;
          toxicity_score: number;
          detected_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          source_url: string;
          toxicity_reason: string;
          toxicity_score: number;
          detected_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          source_url?: string;
          toxicity_reason?: string;
          toxicity_score?: number;
          detected_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "toxic_links_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      issues: {
        Row: {
          id: string;
          project_id: string;
          type: string;
          severity: "low" | "medium" | "high" | "critical";
          pages_affected: number;
          impact_score: number;
          ai_summary: string | null;
          created_at: string;
          status: "open" | "monitoring" | "resolved";
          last_seen: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          type: string;
          severity: "low" | "medium" | "high" | "critical";
          pages_affected: number;
          impact_score: number;
          ai_summary?: string | null;
          created_at?: string;
          status?: "open" | "monitoring" | "resolved";
          last_seen?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          type?: string;
          severity?: "low" | "medium" | "high" | "critical";
          pages_affected?: number;
          impact_score?: number;
          ai_summary?: string | null;
          created_at?: string;
          status?: "open" | "monitoring" | "resolved";
          last_seen?: string;
        };
        Relationships: [
          {
            foreignKeyName: "issues_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      issue_pages: {
        Row: {
          id: string;
          issue_id: string;
          url: string;
          status: "open" | "fixed";
          traffic_loss: number | null;
          last_checked: string;
        };
        Insert: {
          id?: string;
          issue_id: string;
          url: string;
          status?: "open" | "fixed";
          traffic_loss?: number | null;
          last_checked?: string;
        };
        Update: {
          id?: string;
          issue_id?: string;
          url?: string;
          status?: "open" | "fixed";
          traffic_loss?: number | null;
          last_checked?: string;
        };
        Relationships: [
          {
            foreignKeyName: "issue_pages_issue_id_fkey";
            columns: ["issue_id"];
            referencedRelation: "issues";
            referencedColumns: ["id"];
          }
        ];
      };
      fix_logs: {
        Row: {
          id: string;
          issue_id: string;
          user_id: string;
          action: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          issue_id: string;
          user_id: string;
          action: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          issue_id?: string;
          user_id?: string;
          action?: string;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fix_logs_issue_id_fkey";
            columns: ["issue_id"];
            referencedRelation: "issues";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fix_logs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      settings: {
        Row: {
          id: string;
          user_id: string;
          plan_tier: "free" | "starter" | "pro" | "agency";
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_tier?: "free" | "starter" | "pro" | "agency";
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_tier?: "free" | "starter" | "pro" | "agency";
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "settings_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
