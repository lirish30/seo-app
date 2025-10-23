import { Badge, Card, Table, Tbody, Td, Th, Thead, Tr, Text } from "@kibo-ui/react";
import { TopFix } from "../types";

interface TopFixesTableProps {
  fixes: TopFix[];
}

const IMPACT_COLOR: Record<TopFix["impact"], string> = {
  high: "error",
  medium: "warning",
  low: "success",
};

export function TopFixesTable({ fixes }: TopFixesTableProps) {
  if (!fixes.length) {
    return (
      <Card>
        <Card.Body>
          <Text variant="body1">No action items detected 🎉</Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Text variant="h3">Top 5 Fixes</Text>
      </Card.Header>
      <Card.Body>
        <Table>
          <Thead>
            <Tr>
              <Th>Priority</Th>
              <Th>What to fix</Th>
              <Th>Why it matters</Th>
              <Th>How to fix</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fixes.map((fix) => (
              <Tr key={fix.title}>
                <Td>
                  <Badge color={IMPACT_COLOR[fix.impact]}>{fix.impact}</Badge>
                </Td>
                <Td>
                  <Text variant="subtitle1">{fix.title}</Text>
                </Td>
                <Td>
                  <Text variant="body2">{fix.why}</Text>
                </Td>
                <Td>
                  <Text variant="body2">{fix.howToFix}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
