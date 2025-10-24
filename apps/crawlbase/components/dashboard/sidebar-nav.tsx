"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BookOpen,
  GaugeCircle,
  Link2,
  PlusCircle,
  Search,
  Users,
  Wrench
} from "lucide-react";

const navItems = [
  {
    title: "Projects",
    href: "/dashboard",
    icon: GaugeCircle
  },
  {
    title: "Site Health",
    href: "/dashboard/site-health",
    icon: Activity
  },
  {
    title: "Keywords",
    href: "/dashboard/keywords",
    icon: Search
  },
  {
    title: "Competitors",
    href: "/dashboard/competitors",
    icon: Users
  },
  {
    title: "Content",
    href: "/dashboard/content",
    icon: BookOpen
  },
  {
    title: "Backlinks",
    href: "/dashboard/backlinks",
    icon: Link2
  },
  {
    title: "Technical Explorer",
    href: "/dashboard/technical-explorer",
    icon: Wrench
  },
  {
    title: "Create Project",
    href: "/dashboard/projects/new",
    icon: PlusCircle
  }
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 lg:flex">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-semibold">
          Crawlbase
        </Link>
        <Badge variant="outline">Pro</Badge>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href)) ||
            (item.href === "/dashboard" &&
              (pathname === "/dashboard" ||
                /^\/dashboard\/projects\/[A-Za-z0-9-]+/.test(pathname)));
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-primary/10 text-primary"
              )}
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg border border-dashed p-4 text-sm">
        <p className="font-medium">Upgrade to Agency</p>
        <p className="text-muted-foreground">
          Unlock 50 projects, white-label reports, and full API access.
        </p>
      </div>
    </aside>
  );
}
