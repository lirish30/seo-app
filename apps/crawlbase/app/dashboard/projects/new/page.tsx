"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

type FormState = {
  name: string;
  siteUrl: string;
  keywords: string;
  competitors: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  siteUrl: "",
  keywords: "",
  competitors: ""
};

export default function NewProjectPage() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          siteUrl: form.siteUrl,
          keywords: form.keywords,
          competitors: form.competitors
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to create project.");
      }

      const payload = await response.json();
      const projectId = payload.project?.projectId;
      if (!projectId) {
        throw new Error("Project created without identifier.");
      }

      router.push(`/dashboard/projects/${projectId}`);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unexpected error while creating the project."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Create a project</h1>
        <p className="text-sm text-muted-foreground">
          Provide a site URL and focus keywords. We will run Google PageSpeed insights and DataForSEO
          queries on-demand.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>
            Keywords can be separated by new lines. Competitor URLs are optional (comma or new line).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="name">
                Project name
              </label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setForm((previous) => ({ ...previous, name: event.target.value }))
                }
                placeholder="Example Project"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="siteUrl">
                Website URL
              </label>
              <Input
                id="siteUrl"
                required
                value={form.siteUrl}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setForm((previous) => ({ ...previous, siteUrl: event.target.value }))
                }
                placeholder="https://example.com"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="keywords">
                Keywords (one per line)
              </label>
              <Textarea
                id="keywords"
                required
                value={form.keywords}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setForm((previous) => ({ ...previous, keywords: event.target.value }))
                }
                placeholder={`seo analyzer\nseo audit tool\ntechnical seo report`}
                rows={6}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="competitors">
                Competitor URLs (optional)
              </label>
              <Textarea
                id="competitors"
                value={form.competitors}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setForm((previous) => ({ ...previous, competitors: event.target.value }))
                }
                placeholder={`https://ahrefs.com\nhttps://semrush.com`}
                rows={4}
              />
            </div>
            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Unable to create project</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <Button type="submit" disabled={isSubmitting} className="justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running checks...
                </>
              ) : (
                "Create project"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
