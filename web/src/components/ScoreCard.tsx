import {
  Badge,
  Card,
  Progress,
  Stack,
  Text,
  Flex,
} from "@kibo-ui/react";

interface ScoreCardProps {
  title: string;
  score: number;
  description?: string;
}

export function ScoreCard({ title, score, description }: ScoreCardProps) {
  const color = score >= 80 ? "success" : score >= 60 ? "warning" : "error";

  return (
    <Card>
      <Card.Header>
        <Flex justify="space-between" align="center">
          <Text variant="h4">{title}</Text>
          <Badge color={color}>{Math.round(score)}</Badge>
        </Flex>
      </Card.Header>
      <Card.Body>
        <Stack gap="4">
          <Progress color={color} value={score} />
          {description ? (
            <Text variant="body2" color="text.secondary">
              {description}
            </Text>
          ) : null}
        </Stack>
      </Card.Body>
    </Card>
  );
}
