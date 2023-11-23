import { type FC } from "react";
import {
  ResponsiveContainer,
  LineChart as BaseLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

export const LineChart: FC<{
  name: string;
  data: {
    date: string;
    value: number;
  }[];
}> = ({ name, data }) => (
  <ResponsiveContainer height={400}>
    <BaseLineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#1AACFF88" />
      <XAxis dataKey="date" stroke="#1AACFF" />
      <YAxis stroke="#1AACFF" />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#1AACFF"
        strokeWidth="3"
        name={name}
      />
    </BaseLineChart>
  </ResponsiveContainer>
);
