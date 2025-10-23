import {
  Badge,
  Card,
  Stack,
  Text,
  Flex,
  Divider,
} from "@kibo-ui/react";
import { CheckDetail } from "../types";

interface ChecksListProps {
  checks: CheckDetail[];
}

export function ChecksList({ checks }: ChecksListProps) {
  const grouped = checks.reduce<Record<string, CheckDetail[]>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  if (categories.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Text variant="body1">No checks available for this category yet.</Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Stack gap="6">
      {categories.map((category) => (
        <Card key={category}>
          <Card.Header>
            <Text variant="h4">{category}</Text>
          </Card.Header>
          <Card.Body>
            <Stack gap="4">
              {grouped[category].map((check, index) => (
                <Stack key={check.item} gap="2">
                  <Flex justify="space-between" align="center">
                    <Text variant="subtitle1">{check.item}</Text>
                    <Badge color={check.passed ? "success" : "error"}>
                      {check.passed ? "Pass" : "Fail"}
                    </Badge>
                  </Flex>
                  {check.details ? (
                    <Text variant="body2" color="text.secondary">
                      {check.details}
                    </Text>
                  ) : null}
                  {index < grouped[category].length - 1 ? <Divider /> : null}
                </Stack>
              ))}
            </Stack>
          </Card.Body>
        </Card>
      ))}
    </Stack>
  );
}
