import { Buffer } from "buffer";
import type { ParsedOnPageSummary } from "@/lib/parseOnPage";

const DATAFORSEO_BASE_URL = "https://api.dataforseo.com/v3";

type Credentials = {
  login: string;
  password: string;
};

function getCredentials(): Credentials {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error("DATAFORSEO credentials are not configured.");
  }
  return { login, password };
}

export async function fetchOnPageSummary(taskId: string): Promise<ParsedOnPageSummary> {
  const { login, password } = getCredentials();
  const response = await fetch(
    `${DATAFORSEO_BASE_URL}/on_page/summary/${taskId}`,
    {
      headers: {
        authorization: `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`DataForSEO request failed: ${response.statusText}`);
  }

  const payload = await response.json();
  const { parseOnPageSummary } = await import("@/lib/parseOnPage");
  return parseOnPageSummary(payload);
}
