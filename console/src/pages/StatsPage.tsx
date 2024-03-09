import { type FC } from "react";
// import { useLoaderData } from "react-router-dom";
import { isEmpty } from "lodash";
import { AppLayout } from "../layouts/AppLayout/AppLayout";
import { appMenu } from "../constants/appMenu";
import { PageHeader } from "../components/PageHeader";
import { IndicatorsGrid } from "../components/IndicatorsGrid";
import { EmptyData } from "../components/EmptyData";
import { IndicatorsSection } from "../components/IndicatorsSection";
// import type { StatsLoaderResult } from "../types";
import { useStatsPageData } from "../hooks/useStatsPageData";

export const StatsPage: FC = () => {
  // const { stats } = useLoaderData() as StatsLoaderResult;
  const stats = useStatsPageData()!;

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "stats" }}>
      <PageHeader>Общие данные</PageHeader>
      {isEmpty(stats) ? (
        <EmptyData />
      ) : (
        <>
          <IndicatorsGrid
            items={stats.general.map((item) => ({
              key: item.title,
              name: item.title,
              value: item.value,
              deltaPercent: item.differencePercentage,
            }))}
          />
          {stats.groups.map((item) => (
            <IndicatorsSection title={item.title}>
              <IndicatorsGrid
                items={item.values.map((item) => ({
                  key: item.title,
                  sampleGroupId: item.sampleGroupId,
                  name: item.title,
                  value: item.value,
                  deltaPercent: item.differencePercentage,
                }))}
              />
            </IndicatorsSection>
          ))}
        </>
      )}
    </AppLayout>
  );
};
