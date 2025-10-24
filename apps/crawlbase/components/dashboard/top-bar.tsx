"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/dashboard/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Loader2, Plus } from "lucide-react";
import { useMemo } from "react";

const pathMap: Record<string, string> = {
  dashboard: "Dashboard",
  audit: "Site Health",
  keywords: "Keywords",
  competitors: "Competitors",
  content: "Content Intelligence",
  backlinks: "Backlink Monitor",
  "technical-explorer": "Technical Explorer"
};

export function DashboardTopBar() {
  const pathname = usePathname();
  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.slice(0, 3).map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        label: pathMap[segment] ?? segment,
        href
      };
    });
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Breadcrumb items={crumbs} />
        <Button size="sm" variant="outline" className="gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Sync Data
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
