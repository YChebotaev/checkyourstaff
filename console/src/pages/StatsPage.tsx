import { ReactNode, type FC, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { isEmpty } from "lodash";
import { AppLayout } from "../layouts/AppLayout/AppLayout";
import { appMenu } from "../constants/appMenu";
import { PageHeader } from "../components/PageHeader";
import { IndicatorsGrid } from "../components/IndicatorsGrid";
import { EmptyData } from "../components/EmptyData";
import type { StatsLoaderResult } from "../types";

export const StatsPage: FC = () => {
  const { stats } = useLoaderData() as StatsLoaderResult;

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "stats" }}>
      <PageHeader>Общие данные</PageHeader>
      {isEmpty(stats) ? (
        <EmptyData />
      ) : (
        <IndicatorsGrid
          items={[
            {
              key: "job-performance",
              name: "Результаты работы",
              value: stats[1]!,
              deltaPercent: stats.d1,
            },
            {
              key: "workload",
              name: "Нагрузка",
              value: stats[2]!,
              deltaPercent: stats.d2,
            },
            {
              key: "happinness",
              name: "Счастье",
              value: stats[3]!,
              deltaPercent: stats.d3,
            },
            {
              key: "staff-count",
              name: "Сотрудников",
              value: stats.c!,
            },
          ]}
        />
      )}
    </AppLayout>
  );
};
