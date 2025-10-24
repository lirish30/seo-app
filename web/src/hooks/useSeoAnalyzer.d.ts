import { SeoReport } from "../types";
export declare function useSeoAnalyzer(): {
    report: SeoReport;
    loading: boolean;
    error: string;
    analyze: (url: string) => Promise<SeoReport>;
    setError: import("react").Dispatch<import("react").SetStateAction<string>>;
};
