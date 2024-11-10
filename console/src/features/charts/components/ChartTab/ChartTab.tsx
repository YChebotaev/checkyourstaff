import { type FC } from "react";
import { format } from "date-fns";
import type { PollQuestionsDistinctNameRecord } from "@checkyourstaff/console-backend/types";
import { useChartsByQuestion } from "../../hooks/useChartsByQuestion";
import { ChartSection } from "../ChartSection";
import { LineChart } from "../LineChart";
import { Root } from "./styled";

export const ChartTab: FC<{ question: PollQuestionsDistinctNameRecord }> = ({
  question,
}) => {
  const { data } = useChartsByQuestion({ questionId: question.id });

  return (
    <Root>
      {data.map(({ name, values }) => (
        <ChartSection key={name} title={name}>
          <LineChart
            name={name}
            data={values.map(({ date, value }) => ({
              date: format(date, "dd.MM.yyyy"),
              value,
            }))}
          />
        </ChartSection>
      ))}
    </Root>
  );
};
