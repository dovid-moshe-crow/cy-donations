import { Paper, Card, Text } from "@mantine/core";
import React from "react";

function Donation({

  amb,
  amountILS,
  dedication,
  name,
}: {
  name: string;
  amountILS: number;
  dedication: string;
  amb: string;
}) {
  return (
    <Paper  p={4} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      <Card withBorder h={150} shadow="md" radius="md">
        <Text color="blue" weight="bolder" fz={18} align="center">
          {name}
        </Text>
        <Text color="green" fz={20} align="center">
          {amountILS.toFixed(0)}₪
        </Text>
        <Text align="center">{dedication} </Text>
        <Text align="center" color="dimmed">
          {amb}
        </Text>
      </Card>
    </Paper>
  );
}

export default Donation;
