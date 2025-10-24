import { Badge, Card, CardBody, CardHeader } from "@components/ui";
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
        <table>
          <thead>
            <tr>
              <th>Priority</th>
              <th>What to fix</th>
              <th>Why it matters</th>
              <th>How to fix</th>
            </tr>
          </thead>
          <tbody>
            {fixes.map((fix) => (
              <tr key={fix.title}>
                <td>
                  <Badge variant={IMPACT_TONE[fix.impact]}>{fix.impact}</Badge>
                </td>
                <td>
                  <strong>{fix.title}</strong>
                </td>
                <td>
                  <p className="muted-text">{fix.why}</p>
                </td>
                <td>
                  <p className="muted-text">{fix.howToFix}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
