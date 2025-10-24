import { notFound } from "next/navigation";
import { SiteHealthView } from "@/components/dashboard/site-health/site-health-view";

export default function AuditDomainPage({
  params
}: {
  params: { domain?: string };
}) {
  if (!params?.domain) {
    notFound();
  }

  return <SiteHealthView domain={params.domain} />;
}
