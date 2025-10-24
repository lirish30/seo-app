import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui";
import { TopFix } from "../types";

interface TopFixesTableProps {
  fixes: TopFix[];
}

const IMPACT_TONE: Record<TopFix["impact"], "destructive" | "warning" | "success"> = {
  high: "destructive",
  medium: "warning",
  low: "success",
};

export function TopFixesTable({ fixes }: TopFixesTableProps) {
  if (!fixes.length) {
    return (
      <Card>
        <CardBody>
          <p className="muted-text">No action items detected. Keep shipping.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="table-card">
      <CardHeader>
        <h2 className="section-title">Top 5 fixes</h2>
      </CardHeader>
      <CardBody>
        <Table>
          <TableHeader>
            <TableRow className="[&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-[0.1em]">
              <TableHead>Priority</TableHead>
              <TableHead>What to fix</TableHead>
              <TableHead>Why it matters</TableHead>
              <TableHead>How to fix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fixes.map((fix) => (
              <TableRow key={fix.title} className="align-top">
                <TableCell className="font-medium capitalize">
                  <Badge variant={IMPACT_TONE[fix.impact]}>{fix.impact}</Badge>
                </TableCell>
                <TableCell className="font-semibold text-foreground">{fix.title}</TableCell>
                <TableCell>
                  <p className="muted-text">{fix.why}</p>
                </TableCell>
                <TableCell>
                  <p className="muted-text">{fix.howToFix}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
