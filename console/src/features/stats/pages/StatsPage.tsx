import { type FC } from "react";
import { IndicatorsSection } from "../components/IndicatorsSection";
import { IndicatorsGrid } from "../components/IndicatorsGrid";
import { useStatsPageData } from "../hooks/useStatsPageData";
import { AppLayout } from "../../../layouts/AppLayout/AppLayout";
import { appMenu } from "../../../constants/appMenu";
import { PageHeader } from "../../../components/PageHeader";

export const StatsPage: FC = () => {
  const stats = useStatsPageData()!;

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "stats" }}>
      <PageHeader>Общие данные</PageHeader>
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
    </AppLayout>
  );
};
