import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage workspace preferences, notification defaults, and account integrations.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Update high-level options for your Crawlbase workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="font-medium">Workspace name</p>
              <p className="text-sm text-muted-foreground">
                Synchronize this value from your account provider in a future release.
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Default report frequency</p>
                <p className="text-sm text-muted-foreground">
                  Choose how often we refresh analytics across projects.
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Weekly</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Control alerts for changes in rankings, site health, and backlink activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly summary email</p>
                <p className="text-sm text-muted-foreground">Receive a digest of project performance.</p>
              </div>
              <Switch id="weekly-summary" checked readOnly />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Critical alerts</p>
                <p className="text-sm text-muted-foreground">Get notified about outages or major regressions.</p>
              </div>
              <Switch id="critical-alerts" checked readOnly />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
