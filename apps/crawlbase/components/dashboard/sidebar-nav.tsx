"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Bug,
  Compass,
  FileText,
  GaugeCircle,
  Layers3,
  LineChart,
  LinkIcon,
  Settings
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: GaugeCircle
  },
  {
    title: "Site Health",
    href: "/dashboard/audit/demo.com",
    icon: Bug
  },
  {
    title: "Keywords",
    href: "/dashboard/keywords",
    icon: LineChart
  },
  {
    title: "Competitors",
    href: "/dashboard/competitors",
    icon: Compass
  },
  {
    title: "Content",
    href: "/dashboard/content/sample-page",
    icon: FileText
  },
  {
    title: "Backlinks",
    href: "/dashboard/backlinks",
    icon: LinkIcon
  },
  {
    title: "Technical Explorer",
    href: "/dashboard/technical-explorer",
    icon: Layers3
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
          const isActive = pathname === item.href;
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
