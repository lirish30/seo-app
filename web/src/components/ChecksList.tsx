import { Badge, Card, CardBody, CardHeader, Flex, Stack } from "@components/ui";
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
        <CardBody>
          <p className="muted-text">No checks available for this category yet.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Stack gap="2rem">
      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <h3 className="card-heading">{category}</h3>
          </CardHeader>
          <CardBody>
            <Stack gap="1.5rem">
              {grouped[category].map((check, index) => (
                <div key={check.item}>
                  <Flex justify="space-between" align="center">
                    <span className="item-title">{check.item}</span>
                      <Badge variant={check.passed ? "success" : "destructive"}>
                      {check.passed ? "Pass" : "Fail"}
                    </Badge>
                  </Flex>
                  {check.details ? <p className="muted-text">{check.details}</p> : null}
                  {index < grouped[category].length - 1 ? (
                    <div className="checks-section-divider" />
                  ) : null}
                </div>
              ))}
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}
