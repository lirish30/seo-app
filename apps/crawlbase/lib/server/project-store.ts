"use server";

import { promises as fs } from "fs";
import path from "path";
import type { ProjectRecord } from "@/lib/types/project";
import { getSupabaseAdminClient } from "@/lib/clients/supabase-admin";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(STORE_DIR, "projects.json");
const PROJECT_TABLE = "project_records";

let fallbackToFileStore =
  process.env.CRAWLBASE_FORCE_LOCAL_PROJECT_STORE === "true";

type ProjectRecordRow = {
  project_id: string;
  name: string;
  site_url: string;
  record: ProjectRecord;
  created_at: string;
  updated_at: string;
};

export async function listProjectRecords(): Promise<ProjectRecord[]> {
  if (fallbackToFileStore) {
    return listFromFileStore();
  }

  try {
    return await listFromSupabase();
  } catch (error) {
    console.warn(
      "[project-store] Falling back to filesystem store. Reason:",
      error
    );
    fallbackToFileStore = true;
    return listFromFileStore();
  }
}

export async function getProjectRecord(projectId: string): Promise<ProjectRecord | null> {
  if (fallbackToFileStore) {
    return getFromFileStore(projectId);
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from<ProjectRecordRow>(PROJECT_TABLE)
      .select("record")
      .eq("project_id", projectId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data?.record ? normalizeRecord(data.record) : null;
  } catch (error) {
    console.warn(
      `[project-store] Failed to read project ${projectId} from Supabase. Falling back to local store.`,
      error
    );
    fallbackToFileStore = true;
    return getFromFileStore(projectId);
  }
}

export async function upsertProjectRecord(record: ProjectRecord): Promise<void> {
  if (fallbackToFileStore) {
    return upsertFileRecord(record);
  }

  const nextRecord: ProjectRecord = normalizeRecord({
    ...record,
    updatedAt: new Date().toISOString()
  });

  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from(PROJECT_TABLE).upsert(
      {
        project_id: nextRecord.projectId,
        name: nextRecord.name,
        site_url: nextRecord.siteUrl,
        record: nextRecord
      },
      {
        onConflict: "project_id"
      }
    );

    if (error) {
      throw error;
    }
  } catch (error) {
    console.warn(
      "[project-store] Failed to upsert project record into Supabase. Falling back to local store.",
      error
    );
    fallbackToFileStore = true;
    await upsertFileRecord(nextRecord);
  }
}

function normalizeRecord(record: ProjectRecord): ProjectRecord {
  return {
    ...record,
    siteAnalyzerReport: record.siteAnalyzerReport ?? null
  };
}

async function listFromSupabase(): Promise<ProjectRecord[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from<ProjectRecordRow>(PROJECT_TABLE)
    .select("record, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(({ record }) => normalizeRecord(record));
}

async function ensureFileStore(): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({ projects: [] }, null, 2), "utf8");
  }
}

async function readFileStore(): Promise<{ projects: ProjectRecord[] }> {
  await ensureFileStore();
  const file = await fs.readFile(STORE_PATH, "utf8");
  return JSON.parse(file) as { projects: ProjectRecord[] };
}

async function writeFileStore(store: { projects: ProjectRecord[] }): Promise<void> {
  await ensureFileStore();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function listFromFileStore(): Promise<ProjectRecord[]> {
  const store = await readFileStore();
  return store.projects
    .map(normalizeRecord)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function getFromFileStore(projectId: string): Promise<ProjectRecord | null> {
  const store = await readFileStore();
  const record = store.projects.find((project) => project.projectId === projectId);
  return record ? normalizeRecord(record) : null;
}

async function upsertFileRecord(record: ProjectRecord): Promise<void> {
  const store = await readFileStore();
  const index = store.projects.findIndex((project) => project.projectId === record.projectId);
  const next: ProjectRecord = {
    ...record,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    store.projects[index] = next;
  } else {
    store.projects.push(next);
  }

  await writeFileStore(store);
}
