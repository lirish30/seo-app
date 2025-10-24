import { Badge, Card, CardBody, CardHeader, Flex, Stack } from "@components/ui";

interface ScoreCardProps {
  title: string;
  score: number;
  description?: string;
}

export function ScoreCard({ title, score, description }: ScoreCardProps) {
  const tone = score >= 80 ? "success" : score >= 60 ? "warning" : "destructive";

  return (
    <Card>
      <CardHeader>
        <Flex justify="space-between" align="center">
          <h3 className="score-card-title">{title}</h3>
          <Badge variant={tone}>{Math.round(score)}</Badge>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack gap="1rem">
          <div className="score-progress">
            <div
              className="score-progress-bar"
              style={{
                width: `${Math.min(Math.max(score, 0), 100)}%`,
                background:
                  tone === "success"
                    ? "linear-gradient(90deg, #22c55e, #4ade80)"
                    : tone === "warning"
                    ? "linear-gradient(90deg, #facc15, #fbbf24)"
                  : "linear-gradient(90deg, #fb7185, #f43f5e)"
              }}
            />
          </div>
          {description ? <p className="muted-text">{description}</p> : null}
        </Stack>
      </CardBody>
    </Card>
  );
}
