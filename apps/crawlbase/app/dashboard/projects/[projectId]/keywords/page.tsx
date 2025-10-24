import { notFound } from "next/navigation";
import { getProject } from "@/lib/server/projects-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { KeywordsTable } from "@/components/dashboard/keywords/keywords-table";

export default async function ProjectKeywordsPage({
  params
}: {
  params: { projectId: string };
}) {
  const project = await getProject(params.projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Keyword Explorer</h1>
        <p className="text-sm text-muted-foreground">
          Latest keyword metrics refreshed on demand from DataForSEO Keyword Data and SERP APIs.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tracked keywords</CardTitle>
          <CardDescription>
            Click “View SERP” to pull the current top results and ranking position for your domain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KeywordsTable projectId={project.projectId} keywords={project.keywords} />
        </CardContent>
      </Card>
    </div>
  );
}
