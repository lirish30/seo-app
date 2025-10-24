"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface FixHistoryItem {
  id: string;
  action: string;
  user: string;
  created_at: string;
}

export function FixHistory({ history }: { history: FixHistoryItem[] }) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-sm">Fix History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          <ol className="space-y-4">
            {history.map((log, index) => (
              <li key={log.id} className="relative pl-4">
                <span
                  className={cn(
                    "absolute left-0 top-1 h-2 w-2 rounded-full",
                    index === 0 ? "bg-primary" : "bg-muted-foreground/60"
                  )}
                />
                <p className="text-sm font-medium">{log.action}</p>
                <p className="text-xs text-muted-foreground">
                  {log.user} · {format(new Date(log.created_at), "MMM d, yyyy")}
                </p>
              </li>
            ))}
          </ol>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
