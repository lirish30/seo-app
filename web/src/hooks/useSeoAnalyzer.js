import { useState } from "react";
import axios from "axios";
export function useSeoAnalyzer() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const analyze = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post("/api/analyze", { url });
            setReport(data);
            return data;
        }
        catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.message ?? err.message
                : "Failed to analyze URL.");
            throw err;
        }
        finally {
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
