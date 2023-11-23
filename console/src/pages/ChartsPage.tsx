import { type FC } from "react";
import { useLoaderData } from "react-router-dom";
import { isEmpty } from "lodash";
import { format } from "date-fns";
import { AppLayout } from "../layouts/AppLayout/AppLayout";
import { appMenu } from "../constants/appMenu";
import { LineChart } from "../components/LineChart";
import type { ChartsLoaderResult } from "../types";
import { PageHeader } from "../components/PageHeader";
import { SectionHeader } from "../components/SectionHeader";
import { EmptyData } from "../components/EmptyData";

export const ChartsPage: FC = () => {
  const { chartsData } = useLoaderData() as ChartsLoaderResult;

  if (isEmpty(chartsData)) {
    return (
      <AppLayout navMenu={{ items: appMenu, activeKey: "charts" }}>
        <PageHeader>Графики</PageHeader>
        <EmptyData />
      </AppLayout>
    );
  }

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "charts" }}>
      <PageHeader>Графики</PageHeader>
      <div>
        <SectionHeader>Результаты работы</SectionHeader>
        <LineChart
          name="Результаты работы"
          data={chartsData.map((d) => ({
            date: format(Date.parse(d.t), "dd.MM.yyyy"),
            value: d[1],
          }))}
        />
      </div>
      <div>
        <SectionHeader>Нагрузка</SectionHeader>
        <LineChart
          name="Нагрузка"
          data={chartsData.map((d) => ({
            date: format(Date.parse(d.t), "dd.MM.yyyy"),
            value: d[2],
          }))}
        />
      </div>
      <div>
        <SectionHeader>Счастье</SectionHeader>
        <LineChart
          name="Счастье"
          data={chartsData.map((d) => ({
            date: format(Date.parse(d.t), "dd.MM.yyyy"),
            value: d[3],
          }))}
        />
      </div>
    </AppLayout>
  );
};
