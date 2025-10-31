"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/dashboard/breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Settings } from "lucide-react";
import { useMemo } from "react";

const pathMap: Record<string, string> = {
  dashboard: "Overview",
  projects: "Projects",
  keywords: "Keywords",
  competitors: "Competitors"
};

export function DashboardTopBar() {
  const pathname = usePathname();

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

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center">
        <Breadcrumb items={crumbs} />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" asChild>
          <Link href="/dashboard/projects/new">
            + New Project
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/settings" aria-label="Settings">
            <Settings className="h-4 w-4" />
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
