import { DashboardNav } from "@/components/dashboard/sidebar-nav";
import { DashboardTopBar } from "@/components/dashboard/top-bar";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <div className="flex flex-1 flex-col">
        <DashboardTopBar />
        <main className="flex-1 space-y-8 bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  );
}
