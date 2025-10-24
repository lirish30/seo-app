"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ProjectRescanButtonProps {
  projectId: string;
}

export function ProjectRescanButton({ projectId }: ProjectRescanButtonProps) {
  const [isRescanning, setIsRescanning] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRescan = async () => {
    if (isRescanning) return;
    setIsRescanning(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "refresh" })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Failed to trigger DataForSEO crawl.");
      }

      toast({
        title: "Rescan queued",
        description: "Running DataForSEO + PageSpeed crawls to refresh project metrics."
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Rescan failed",
        description:
          error instanceof Error
            ? error.message
            : "Unexpected error while requesting a new crawl."
      });
    } finally {
      setIsRescanning(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      disabled={isRescanning}
      onClick={handleRescan}
    >
      {isRescanning ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RotateCw className="h-4 w-4" />
      )}
      Rescan
    </Button>
  );
}
