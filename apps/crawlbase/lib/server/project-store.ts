"use server";

import { promises as fs } from "fs";
import path from "path";
import type { ProjectRecord } from "@/lib/types/project";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(STORE_DIR, "projects.json");

async function ensureStore(): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({ projects: [] }, null, 2), "utf8");
  }
}

async function readStore(): Promise<{ projects: ProjectRecord[] }> {
  await ensureStore();
  const file = await fs.readFile(STORE_PATH, "utf8");
  return JSON.parse(file) as { projects: ProjectRecord[] };
}

async function writeStore(store: { projects: ProjectRecord[] }): Promise<void> {
  await ensureStore();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function listProjectRecords(): Promise<ProjectRecord[]> {
  const store = await readStore();
  return store.projects.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getProjectRecord(projectId: string): Promise<ProjectRecord | null> {
  const store = await readStore();
  return store.projects.find((project) => project.projectId === projectId) ?? null;
}

export async function upsertProjectRecord(record: ProjectRecord): Promise<void> {
  const store = await readStore();
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

  await writeStore(store);
}
