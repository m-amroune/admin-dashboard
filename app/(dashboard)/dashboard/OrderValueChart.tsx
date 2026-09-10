"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OrderValue = {
  reference: string;
  amount: number;
};

export default function OrderValueChart({
  data,
}: {
  data: OrderValue[];
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />

        <XAxis
          dataKey="reference"
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={(value) => `$${value}`}
        />

        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
        />

        <Bar
          dataKey="amount"
          fill="#3b82f6"
          radius={[5, 5, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}