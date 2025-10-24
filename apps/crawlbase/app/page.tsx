import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-background to-muted">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">
          Crawlbase
          <span className="block text-primary">SEO Intelligence Platform</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          Unified technical audits, keyword tracking, competitor monitoring, and
          AI-powered insights tailored for lean B2B marketing teams.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
