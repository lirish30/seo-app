import { useState } from "react";
import axios from "axios";
import { SeoReport } from "../types";

export function useSeoAnalyzer() {
  const [report, setReport] = useState<SeoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post<SeoReport>("/api/analyze", { url });
      setReport(data);
      return data;
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message
          : "Failed to analyze URL.",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    report,
    loading,
    error,
    analyze,
    setError,
  };
}
