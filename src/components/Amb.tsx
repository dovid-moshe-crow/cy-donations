import { Paper, Card, Progress, Text } from "@mantine/core";
import React from "react";

function Amb({
  amountILS,
  name,
  percent,
  target,
}: {
  name: string;
  target: number;
  amountILS: number;
  percent: number;
}) {
  return (
    <Paper p={4} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      <Card withBorder h={150} shadow="md" radius="md">
        <Text color="blue" weight="bolder" fz={18} align="center">
          {name}
        </Text>
        <Text color="green" fz={20} align="center">
          {target}₪ / {amountILS.toFixed(0)}₪
        </Text>
        <Progress value={percent} mt="md" size="lg" radius="xl" />
      </Card>
    </Paper>
  );
}

export default Amb;
