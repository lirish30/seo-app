"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/dashboard/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Loader2, Plus, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const pathMap: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  keywords: "Keywords",
  competitors: "Competitors"
};

export function DashboardTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.slice(0, 4).map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const parent = segments[index - 1];
      const label =
        pathMap[segment] ??
        (parent === "projects" && index === 2 ? "Project" : segment);
      return {
        label,
        href
      };
    });
  }, [pathname]);

  const projectId = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "dashboard" && segments[1] === "projects" && segments[2]) {
      return segments[2];
    }
    return null;
  }, [pathname]);

  const handleSync = async () => {
    if (!projectId) return;
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ action: "refresh" })
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to refresh project");
      }
      toast({
        title: "Project refreshed",
        description: "Latest metrics fetched from Google PSI and DataForSEO."
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Refresh failed",
        description:
          error instanceof Error
            ? error.message
            : "Unexpected error fetching analytics."
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Breadcrumb items={crumbs} />
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          disabled={!projectId || isSyncing}
          onClick={handleSync}
        >
          {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
          Sync data
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" className="gap-2" asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Avatar>
          <AvatarFallback>LI</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
