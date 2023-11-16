import { type FC } from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { useWindowSize } from "@react-hook/window-size";

export const SummaryChart: FC<{ data: any }> = ({ data }) => {
  const [width, height] = useWindowSize();

  console.log('data =', data)

  return (
    <LineChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="t" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Удовлетворенность" stroke="#8884d8" />
      <Line type="monotone" dataKey="Нагрузка" stroke="#82ca9d" />
      <Line type="monotone" dataKey="Счастье" stroke="#ffd884" />
    </LineChart>
  );
};
